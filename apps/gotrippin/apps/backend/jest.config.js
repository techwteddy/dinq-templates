/**
 * Jest configuration for the NestJS backend.
 * Spec files live next to source files as `*.spec.ts`.
 * No real Supabase connection — services are constructed with mocked dependencies.
 */
module.exports = {
  testEnvironment: "node",
  rootDir: "./src",
  testMatch: ["**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/../tsconfig.spec.json",
      },
    ],
  },
};
