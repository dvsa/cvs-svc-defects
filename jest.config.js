module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  setupFiles: ["jest-plugin-context/setup"],
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  "coverageDirectory": "./coverage",
  "collectCoverage": true,
  "testResultsProcessor": "jest-sonar-reporter",
};
