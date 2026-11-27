// Seeds crafts, standard roadmaps, opportunities and fallback market trends.
// NOT touched: users, their personal AI roadmaps, and cached AI market trends.
//
//   npm run seed            -> reseed everything
//   npm run seed -- pottery -> reseed only the listed craft(s)

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { connectDB, disconnectDB } from '../config/db.js';
import { CRAFT_SLUGS, LEVELS } from '../config/constants.js';
import Craft from '../models/Craft.js';
import Roadmap from '../models/Roadmap.js';
import Opportunity from '../models/Opportunity.js';
import MarketTrends from '../models/MarketTrends.js';

const here = path.dirname(fileURLToPath(import.meta.url));

function checkShape(slug, data) {
  const problems = [];
  if (data.craft?.slug !== slug) problems.push(`craft.slug should be "${slug}"`);
  for (const level of LEVELS) {
    const steps = data.roadmaps?.[level];
    if (!Array.isArray(steps) || steps.length === 0) problems.push(`roadmaps.${level} is missing or empty`);
  }
  if (!Array.isArray(data.opportunities)) problems.push('opportunities must be an array');
  if (!data.trends) problems.push('trends is missing');
  if (problems.length) throw new Error(`seed/${slug}.js: ${problems.join('; ')}`);
}

async function seedCraft(slug, data) {
  checkShape(slug, data);

  await Promise.all([
    Craft.deleteMany({ slug }),
    Roadmap.deleteMany({ craft: slug }),
    Opportunity.deleteMany({ craft: slug }),
    MarketTrends.deleteMany({ craft: slug, source: 'seed' }), // keep cached AI trends
  ]);

  await Craft.create(data.craft);
  await Roadmap.insertMany(
    LEVELS.map((level) => ({
      craft: slug,
      level,
      steps: data.roadmaps[level].map((s, i) => ({ order: i + 1, ...s })),
    }))
  );
  await Opportunity.insertMany(data.opportunities.map((o) => ({ craft: slug, ...o })));
  await MarketTrends.create({ craft: slug, source: 'seed', lastUpdated: new Date(), ...data.trends });

  const stepCount = LEVELS.reduce((n, l) => n + data.roadmaps[l].length, 0);
  console.log(`  ✅ ${data.craft.icon} ${data.craft.name}: ${stepCount} steps, ${data.opportunities.length} opportunities, trends`);
}

async function main() {
  const requested = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const invalid = requested.filter((s) => !CRAFT_SLUGS.includes(s));
  if (invalid.length) {
    console.error(`❌ Unknown craft(s): ${invalid.join(', ')}. Valid: ${CRAFT_SLUGS.join(', ')}`);
    process.exit(1);
  }
  const slugs = requested.length ? requested : CRAFT_SLUGS;

  await connectDB();
  await MarketTrends.syncIndexes(); // trends are unique per craft + source
  console.log('🌱 Seeding HastaNova data...');

  const skipped = [];
  for (const slug of slugs) {
    const file = path.join(here, `${slug}.js`);
    if (!existsSync(file)) {
      skipped.push(slug);
      continue;
    }
    const { default: data } = await import(pathToFileURL(file).href);
    await seedCraft(slug, data);
  }

  if (skipped.length) console.warn(`  ⚠️  No data file yet for: ${skipped.join(', ')} (skipped)`);
  console.log('🎉 Seeding complete.');
  await disconnectDB();
}

main().catch(async (err) => {
  console.error('❌ Seeding failed:', err.message);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
