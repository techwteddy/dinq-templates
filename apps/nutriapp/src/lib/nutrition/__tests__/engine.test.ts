#!/usr/bin/env tsx
/**
 * Test manual del motor nutricional.
 * Ejecutar con: npm run test:nutrition
 *
 * No requiere framework de testing — los valores esperados están codificados
 * en las funciones _test* de cada módulo y aquí en el test de integración.
 */

import { _testBMR } from "../bmr";
import { _testTDEE } from "../tdee";
import { _testTargets } from "../targets";
import { computeTargets } from "../index";
import type { UserProfile, UserSettings } from "@/db/types";

console.log("\n═══════════════════════════════════");
console.log("  Motor nutricional — Suite de test");
console.log("═══════════════════════════════════\n");

console.log("── BMR (Mifflin-St Jeor) ──────────");
_testBMR();

console.log("\n── TDEE ───────────────────────────");
_testTDEE();

console.log("\n── Targets calóricos y macros ─────");
_testTargets();

console.log("\n── Integración: computeTargets() ──");

const profile: UserProfile = {
  id: "test",
  age: 30,
  sex: "male",
  heightCm: 175,
  weightKg: 75,
  activityLevel: "moderate",
  goal: "cut",
  healthFlags: {
    isPregnant: false,
    isBreastfeeding: false,
    isDiabetic: false,
    hasKidneyDisease: false,
  },
};

const settings: UserSettings = {
  id: "test",
  weightUnit: "kg",
  heightUnit: "cm",
  macroPct: { protein: 35, fat: 25, carbs: 40 },
  maxDeficitKcal: 500,
  maxSurplusKcal: 300,
  minCaloriesKcal: 1200,
  notificationsEnabled: false,
};

const targets = computeTargets(profile, settings);

console.log(`BMR:              ${targets.bmr} kcal`);
console.log(`TDEE:             ${targets.tdee} kcal`);
console.log(`Target calories:  ${targets.targetCalories} kcal`);
console.log(`Deficit:          ${targets.deficit} kcal`);
console.log(`Proteína:         ${targets.macros.proteinG}g (${targets.macros.proteinKcal} kcal)`);
console.log(`Grasa:            ${targets.macros.fatG}g (${targets.macros.fatKcal} kcal)`);
console.log(`Carbos:           ${targets.macros.carbsG}g (${targets.macros.carbsKcal} kcal)`);

const totalKcal =
  targets.macros.proteinKcal +
  targets.macros.fatKcal +
  targets.macros.carbsKcal;

const macroBalanceOk = Math.abs(totalKcal - targets.targetCalories) <= 5;
console.log(
  `\n${macroBalanceOk ? "✅" : "❌"} Balance de macros: ${totalKcal} kcal (target: ${targets.targetCalories})`
);

console.log("\n═══════════════════════════════════\n");
