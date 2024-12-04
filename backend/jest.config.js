module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/routes/**",
    "!src/middlewares/**",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFiles: ["dotenv/config"],
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
