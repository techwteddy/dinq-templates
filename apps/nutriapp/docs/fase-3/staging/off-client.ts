/**
 * src/lib/off-client.ts
 * Cliente para Open Food Facts API v2
 * Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
 */

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2';
const USER_AGENT = 'NutricionApp/1.0 (personal; contacto@ejemplo.com)';

// ─── Tipos raw de OFF ────────────────────────────────────────────────────────

export interface OFFNutriments {
  'energy-kcal_100g'?: number;
  'energy-kcal_serving'?: number;
  proteins_100g?: number;
  proteins_serving?: number;
  carbohydrates_100g?: number;
  carbohydrates_serving?: number;
  fat_100g?: number;
  fat_serving?: number;
  fiber_100g?: number;
  fiber_serving?: number;
  sugars_100g?: number;
  sodium_100g?: number;
  salt_100g?: number;
  calcium_100g?: number;
  iron_100g?: number;
  potassium_100g?: number;
  'vitamin-d_100g'?: number;
  [key: string]: number | undefined;
}

export interface OFFProductRaw {
  code: string;
  status: number;         // 1 = found, 0 = not found
  product?: {
    product_name?: string;
    product_name_es?: string;
    brands?: string;
    quantity?: string;
    serving_size?: string;
    image_front_url?: string;
    nutriments?: OFFNutriments;
    completeness?: number;   // 0-100
    data_quality_tags?: string[];
    nutrition_grade_fr?: string;  // a-e
    categories_tags?: string[];
  };
}

// ─── Tipo normalizado (compatible con foods_master) ───────────────────────────

export interface OFFNormalized {
  barcode: string;
  name: string;
  brand?: string;
  source: 'OFF';
  // Nutrientes por 100 g (base de foods_master)
  kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  fiber_g_per_100g: number;
  sodium_mg_per_100g: number;
  calcium_mg_per_100g: number;
  iron_mg_per_100g: number;
  potassium_mg_per_100g: number;
  vitamin_d_mcg_per_100g: number;
  // Porción sugerida
  serving_size_g?: number;
  // Calidad del dato
  completeness: number;     // 0-100 de OFF
  confidence_level: number; // 1-5 traducido a nuestro sistema de Fase 2
  has_missing_macros: boolean;
  // Raw original para auditoría
  off_raw: OFFProductRaw['product'];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseServingG(servingStr?: string): number | undefined {
  if (!servingStr) return undefined;
  // Acepta "30 g", "30g", "1 oz (28g)", etc.
  const match = servingStr.match(/(\d+(?:[.,]\d+)?)\s*g/i);
  if (match) return parseFloat(match[1].replace(',', '.'));
  // Si viene en oz
  const ozMatch = servingStr.match(/(\d+(?:[.,]\d+)?)\s*oz/i);
  if (ozMatch) return parseFloat(ozMatch[1]) * 28.3495;
  return undefined;
}

function n(val?: number): number {
  return typeof val === 'number' && isFinite(val) ? val : 0;
}

/**
 * Calcula nivel de confianza 1-5 basado en completitud OFF y macros presentes.
 * Sistema de Fase 2: 5=alta fiabilidad, 1=baja.
 */
function calcConfidence(
  completeness: number,
  hasMissing: boolean,
  nutriments: OFFNutriments
): number {
  if (completeness >= 80 && !hasMissing) return 4;
  if (completeness >= 60 && !hasMissing) return 3;
  if (completeness >= 40)               return 2;
  return 1;
}

// ─── Normalización ───────────────────────────────────────────────────────────

export function normalizeOFFProduct(raw: OFFProductRaw): OFFNormalized | null {
  if (raw.status !== 1 || !raw.product) return null;

  const p = raw.product;
  const nr = p.nutriments ?? {};

  const kcal       = n(nr['energy-kcal_100g']);
  const protein    = n(nr.proteins_100g);
  const carbs      = n(nr.carbohydrates_100g);
  const fat        = n(nr.fat_100g);
  const fiber      = n(nr.fiber_100g);
  const sodium_g   = n(nr.sodium_100g ?? (nr.salt_100g ? nr.salt_100g / 2.5 : undefined));
  const calcium    = n(nr.calcium_100g);
  const iron       = n(nr.iron_100g);
  const potassium  = n(nr.potassium_100g);
  const vitamin_d  = n(nr['vitamin-d_100g']);
  const completeness = p.completeness ?? 0;

  const hasMissing = kcal === 0 || (protein === 0 && carbs === 0 && fat === 0);

  const name =
    p.product_name_es?.trim() ||
    p.product_name?.trim() ||
    `Producto ${raw.code}`;

  return {
    barcode: raw.code,
    name,
    brand: p.brands?.split(',')[0]?.trim(),
    source: 'OFF',
    kcal_per_100g:        kcal,
    protein_g_per_100g:   protein,
    carbs_g_per_100g:     carbs,
    fat_g_per_100g:       fat,
    fiber_g_per_100g:     fiber,
    sodium_mg_per_100g:   sodium_g * 1000,
    calcium_mg_per_100g:  calcium * 1000,
    iron_mg_per_100g:     iron * 1000,
    potassium_mg_per_100g: potassium * 1000,
    vitamin_d_mcg_per_100g: vitamin_d * 1_000_000, // g → mcg
    serving_size_g:       parseServingG(p.serving_size),
    completeness,
    confidence_level: calcConfidence(completeness, hasMissing, nr),
    has_missing_macros: hasMissing,
    off_raw: p,
  };
}

// ─── Fetcher principal ────────────────────────────────────────────────────────

export class OFFClient {
  private static async fetch(barcode: string): Promise<OFFProductRaw> {
    const url = `${OFF_BASE}/product/${encodeURIComponent(barcode)}` +
      `?fields=code,product_name,product_name_es,brands,quantity,serving_size,` +
      `image_front_url,nutriments,completeness,data_quality_tags,nutrition_grade_fr`;

    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 3600 }, // cache 1 h en Next.js
    });

    if (!res.ok) {
      throw new Error(`OFF API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<OFFProductRaw>;
  }

  /**
   * Busca y normaliza un producto por código de barras.
   * Retorna null si no existe en OFF o el barcode es inválido.
   */
  static async getByBarcode(barcode: string): Promise<OFFNormalized | null> {
    const clean = barcode.replace(/\D/g, '');
    if (clean.length < 8) return null; // EAN-8 mínimo

    try {
      const raw = await OFFClient.fetch(clean);
      return normalizeOFFProduct(raw);
    } catch (err) {
      console.error('[OFFClient] fetch error:', err);
      return null;
    }
  }

  /**
   * Comprueba si hay datos de calidad mínima para mostrar sin advertencia.
   */
  static isReliable(product: OFFNormalized): boolean {
    return product.confidence_level >= 3 && !product.has_missing_macros;
  }
}
