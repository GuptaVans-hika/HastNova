import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export const formatZodIssues = (err) =>
  err.issues.map((i) => ({ field: i.path.join('.') || '(body)', message: i.message }));

// Centralised error handler - every error ends here and gets a consistent JSON shape:
// { success: false, message, details? }
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let details = err.details;

  if (err instanceof ZodError) {
    status = 400;
    message = 'Please check the highlighted fields.';
    details = formatZodIssues(err);
  } else if (err.name === 'ValidationError') {
    // Mongoose schema validation
    status = 400;
    message = 'Invalid data.';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}.`;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = field === 'phone' ? 'This phone number is already registered. Please log in.' : `This ${field} is already taken.`;
    details = [{ field, message }];
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid session. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Your session has expired. Please log in again.';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large.';
  }

  if (status >= 500) {
    console.error(`💥 ${req.method} ${req.originalUrl}`, err);
    if (env.isProd) message = 'Something went wrong on our side. Please try again.';
  }

  res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
    ...(!env.isProd && status >= 500 && { stack: err.stack }),
  });
}
