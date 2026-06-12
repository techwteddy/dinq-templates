/**
 * Jest configuration for `@gotrippin/core`.
 * Source files are TypeScript; tests live next to them as `*.spec.ts`.
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
