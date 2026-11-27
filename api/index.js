// Vercel serverless entry point for the Express API.
// vercel.json sends every /api/* request here; Express then routes it as usual.
// The app and the database connection are created once per warm instance and reused.

let ready = null;

async function loadApp() {
  const [{ default: app }, { connectDB }] = await Promise.all([
    import('../server/app.js'),
    import('../server/config/db.js'),
  ]);
  await connectDB();
  return app;
}

export default async function handler(req, res) {
  try {
    ready ??= loadApp();
    const app = await ready;
    return app(req, res);
  } catch (err) {
    ready = null; // try again on the next request
    console.error('💥 API setup failed:', err.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(
      JSON.stringify({
        success: false,
        message: 'The server is not set up correctly yet. Check the Vercel function logs.',
        // names what is wrong (e.g. a missing env var or a blocked database) - never a secret
        reason: err.message.slice(0, 300),
      })
    );
  }
}
