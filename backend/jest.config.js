module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports/junit",
        outputName: "junit.xml",
      },
    ],
  ],
};
