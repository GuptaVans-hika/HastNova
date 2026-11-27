import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(uri = env.mongoUri) {
  mongoose.set('strictQuery', true);
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.error('   Check MONGODB_URI in .env, that MongoDB is running, and (Atlas) that your IP is allowed.');
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
