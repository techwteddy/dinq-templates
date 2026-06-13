/**
 * Motor nutricional — punto de entrada público.
 *
 * Uso:
 *   import { calculateBMR_MifflinStJeor, calculateTDEE, computeTargets } from "@/lib/nutrition";
 */

export { calculateBMR_MifflinStJeor } from "./bmr";
export {
  calculateTDEE,
  ACTIVITY_MULTIPLIERS,
  ACTIVITY_LABELS,
  ACTIVITY_DESCRIPTIONS,
} from "./tdee";
export {
  calculateCalorieTargets,
  calculateMacroTargets,
  AMDR_RANGES,
} from "./targets";
export {
  getDRI,
  getMinProteinG,
  getReferenceEER,
  getAgeGroup,
  MICRONUTRIENT_DRI,
  EER_REFERENCE,
} from "./dri";

import { calculateBMR_MifflinStJeor } from "./bmr";
import { calculateTDEE } from "./tdee";
import { calculateCalorieTargets, calculateMacroTargets } from "./targets";
import type { UserProfile, UserSettings, NutritionTargets } from "@/db/types";

/**
 * Función de conveniencia: calcula todos los targets en una sola llamada.
 *
 * @param profile  - Perfil completo del usuario.
 * @param settings - Configuración (unidades, macros, límites).
 * @returns NutritionTargets con BMR, TDEE, calorías objetivo y macros.
 */
export function computeTargets(
  profile: UserProfile,
  settings: UserSettings
): NutritionTargets {
  const bmr = calculateBMR_MifflinStJeor(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const { targetCalories, deficit } = calculateCalorieTargets({
    tdee,
    goal: profile.goal,
    healthFlags: profile.healthFlags,
    settings,
  });
  const macros = calculateMacroTargets({
    targetCalories,
    macroPct: settings.macroPct,
  });

  return { bmr, tdee, targetCalories, deficit, macros };
}
