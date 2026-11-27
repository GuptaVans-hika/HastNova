import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import app from './app.js';
import MarketTrends from './models/MarketTrends.js';
import UserRoadmap from './models/UserRoadmap.js';
import { isAIConfigured } from './services/llm/index.js';

await connectDB();
// Apply index changes (e.g. trends are now unique per craft + source, not per craft)
await Promise.all([MarketTrends.syncIndexes(), UserRoadmap.syncIndexes()]);
console.log(isAIConfigured() ? `🤖 AI providers: ${env.llm.order.join(' -> ')}` : '⚠️  No AI keys set - using seeded data only');

const server = app.listen(env.port, () => {
  console.log(`🚀 HastaNova API running on http://localhost:${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal) {
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled rejection:', err);
});
