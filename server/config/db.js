import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

let connecting = null;

// Connects once and reuses the connection. On Vercel each warm function instance
// handles many requests, so this avoids opening a new connection per request.
// Throws on failure (the caller decides whether to exit or return an error).
export function connectDB(uri = env.mongoUri) {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  connecting ??= mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 })
    .then((conn) => {
      console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn.connection;
    })
    .catch((err) => {
      connecting = null; // let the next request try again
      console.error(`❌ MongoDB connection failed: ${err.message}`);
      console.error('   Check MONGODB_URI, that MongoDB is running, and (Atlas) Network Access.');
      throw err;
    });
  return connecting;
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
