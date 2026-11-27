// Copies all HastaNova data from one MongoDB to another (e.g. local -> Atlas).
// Source = SOURCE_MONGODB_URI (default: local), target = MONGODB_URI from .env.
//
//   npm run copy-db                 copy into empty target collections only (safe)
//   npm run copy-db -- --overwrite  replace target collections that already have data
//
// Connection strings are never printed in full (passwords are hidden).
import 'dotenv/config';
import mongoose from 'mongoose';

const COLLECTIONS = ['users', 'userroadmaps', 'markettrends', 'crafts', 'roadmaps', 'opportunities'];
const source = process.env.SOURCE_MONGODB_URI || 'mongodb://127.0.0.1:27017/karigarskill';
const target = process.env.MONGODB_URI;
const overwrite = process.argv.includes('--overwrite');

const hide = (uri) => uri.replace(/\/\/([^:/@]+):[^@]+@/, '//$1:****@');

if (!target || /<[A-Z_]*PASSWORD[A-Z_]*>|<password>/i.test(target)) {
  console.error('❌ Set MONGODB_URI in server/.env (with your real password) before copying.');
  process.exit(1);
}
if (source === target) {
  console.error('❌ Source and target are the same database.');
  process.exit(1);
}

async function main() {
  console.log(`From: ${hide(source)}\nTo:   ${hide(target)}\n`);
  const [from, to] = await Promise.all([
    mongoose.createConnection(source, { serverSelectionTimeoutMS: 10000 }).asPromise(),
    mongoose.createConnection(target, { serverSelectionTimeoutMS: 15000 }).asPromise(),
  ]);

  for (const name of COLLECTIONS) {
    const docs = await from.db.collection(name).find().toArray();
    const existing = await to.db.collection(name).countDocuments();
    if (existing && !overwrite) {
      console.log(`  ⏭️  ${name}: target already has ${existing} documents - skipped (use --overwrite to replace)`);
      continue;
    }
    if (existing) await to.db.collection(name).deleteMany({});
    if (docs.length) await to.db.collection(name).insertMany(docs, { ordered: false });
    console.log(`  ✅ ${name}: copied ${docs.length}`);
  }

  await Promise.all([from.close(), to.close()]);
  console.log('\n🎉 Done. Start the server (npm run dev) - it creates the indexes on startup.');
}

main().catch((err) => {
  console.error(`❌ Copy failed: ${err.message}`);
  if (/auth|bad auth/i.test(err.message)) console.error('   Check the Atlas username/password in server/.env.');
  if (/ENOTFOUND|timed out|Server selection/i.test(err.message))
    console.error('   Check your internet and that your IP is allowed in Atlas -> Network Access.');
  process.exit(1);
});
