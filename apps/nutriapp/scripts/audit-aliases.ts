import { loadEnvConfig } from '@next/env';
import { searchFoodsWithMeta } from '../src/db/queries/food-repository';
import { getFoodDisplayName, resolveFoodSearchAlias } from '../src/lib/nutrition/aliases';
import { FOOD_CACHE_TERMS_ES_PE } from './food-cache-terms';

loadEnvConfig(process.cwd());

function isRateLimitMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('limite') || lower.includes('rate limit') || lower.includes('429');
}

async function main() {
  const terms = process.argv.slice(2);
  const queue = terms.length > 0 ? terms : [...FOOD_CACHE_TERMS_ES_PE, 'olluco', 'mashua'];

  console.log('Alias audit Fietly - es-PE -> FDC');
  console.log('');

  for (const term of queue) {
    const canonical = resolveFoodSearchAlias(term);
    console.log(`Alias: "${term}"`);
    console.log(`-> Query: "${canonical}"`);

    try {
      const result = await searchFoodsWithMeta({ query: term, pageSize: 10 });
      const top = result.foods.slice(0, 3);

      if (top.length === 0) {
        console.log('-> Sin resultados');
      } else {
        top.forEach((food, index) => {
          console.log(
            `-> ${index + 1}) ${getFoodDisplayName(food.name)} [${food.external_id ?? food.id}] - ${Math.round(food.kcal)} kcal/100g`
          );
        });
      }

      if (result.warning) {
        console.log(`-> Aviso: ${result.warning}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log(`-> ERROR: ${message}`);
      if (isRateLimitMessage(message)) {
        console.log('');
        console.log('FDC rate limit detected. Stopping alias audit to avoid more API calls.');
        break;
      }
    }

    console.log('');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
