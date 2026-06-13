import { loadEnvConfig } from '@next/env';
import { searchFoodsWithMeta } from '../src/db/queries/food-repository';
import { FOOD_CACHE_TERMS_ES_PE } from './food-cache-terms';

loadEnvConfig(process.cwd());

function isRateLimitMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('limite') || lower.includes('rate limit') || lower.includes('429');
}

async function main() {
  const terms = process.argv.slice(2);
  const queue = terms.length > 0 ? terms : [...FOOD_CACHE_TERMS_ES_PE];
  const pending: string[] = [];
  const failed: string[] = [];

  console.log('Warm cache Fietly - foods_master');
  console.log(`Terms: ${queue.join(', ')}`);
  console.log('');

  for (let index = 0; index < queue.length; index += 1) {
    const term = queue[index];

    try {
      const result = await searchFoodsWithMeta({ query: term, pageSize: 10 });
      const first = result.foods[0];
      const firstLine = first ? `${first.name} (${Math.round(first.kcal)} kcal/100g)` : 'sin resultados';

      console.log(
        `[${index + 1}/${queue.length}] ${term} -> ${result.canonicalQuery} | ${result.source} | ${result.foods.length} result(s) | ${firstLine}`
      );

      if (result.warning) {
        console.log(`  warning: ${result.warning}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log(`[${index + 1}/${queue.length}] ${term} -> ERROR: ${message}`);
      failed.push(term);

      if (isRateLimitMessage(message)) {
        pending.push(term, ...queue.slice(index + 1));
        console.log('');
        console.log('FDC rate limit detected. Stopping warm-up to avoid more API calls.');
        break;
      }
    }
  }

  if (failed.length > 0) {
    console.log('');
    console.log(`Failed terms: ${failed.join(', ')}`);
  }

  if (pending.length > 0) {
    console.log('');
    console.log(`Pending terms: ${pending.join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
