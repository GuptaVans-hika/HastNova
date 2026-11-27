import { AppError, formatZodIssues } from './errorHandler.js';

// validate(schema, 'body' | 'query' | 'params')
// Replaces the request part with the parsed (trimmed / coerced) data.
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      return next(new AppError('Please check the highlighted fields.', 400, formatZodIssues(result.error)));
    }
    // req.query is a getter in some Express versions, so define it explicitly
    Object.defineProperty(req, source, { value: result.data, writable: true, configurable: true, enumerable: true });
    next();
  };
