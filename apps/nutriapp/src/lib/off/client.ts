const OFF_BASE = process.env.OPEN_FOOD_FACTS_BASE_URL ?? "https://world.openfoodfacts.org/api/v2";
const USER_AGENT = "NutriApp/1.0 (personal app)";

export interface OFFProduct {
  barcode: string;
  name: string;
  brand?: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  potassium_mg: number;
  vitamin_d_mcg: number;
  completeness: number;
  has_missing_macros: boolean;
  raw: unknown;
}

function n(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export class OFFClient {
  static async getByBarcode(barcode: string): Promise<OFFProduct | null> {
    const clean = barcode.replace(/\D/g, "");
    if (clean.length < 8) return null;

    const url =
      `${OFF_BASE}/product/${encodeURIComponent(clean)}` +
      "?fields=code,product_name,product_name_es,brands,nutriments,completeness";
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const raw = (await response.json()) as {
      status?: number;
      code?: string;
      product?: {
        product_name?: string;
        product_name_es?: string;
        brands?: string;
        completeness?: number;
        nutriments?: Record<string, number>;
      };
    };
    if (raw.status !== 1 || !raw.product) return null;

    const nutriments = raw.product.nutriments ?? {};
    const kcal = n(nutriments["energy-kcal_100g"]);
    const protein = n(nutriments.proteins_100g);
    const carbs = n(nutriments.carbohydrates_100g);
    const fat = n(nutriments.fat_100g);
    const hasMissingMacros = kcal === 0 || (protein === 0 && carbs === 0 && fat === 0);

    return {
      barcode: raw.code ?? clean,
      name: raw.product.product_name_es?.trim() || raw.product.product_name?.trim() || `Producto ${clean}`,
      brand: raw.product.brands?.split(",")[0]?.trim(),
      kcal,
      protein_g: protein,
      carbs_g: carbs,
      fat_g: fat,
      fiber_g: n(nutriments.fiber_100g),
      sugar_g: n(nutriments.sugars_100g),
      sodium_mg: n(nutriments.sodium_100g) * 1000,
      calcium_mg: n(nutriments.calcium_100g) * 1000,
      iron_mg: n(nutriments.iron_100g) * 1000,
      potassium_mg: n(nutriments.potassium_100g) * 1000,
      vitamin_d_mcg: n(nutriments["vitamin-d_100g"]) * 1_000_000,
      completeness: raw.product.completeness ?? 0,
      has_missing_macros: hasMissingMacros,
      raw: raw.product,
    };
  }
}
