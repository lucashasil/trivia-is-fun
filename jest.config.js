/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(scss|css|less)$": "<rootDir>/__mocks__/styleMock.ts"
  },
  setupFilesAfterEnv: [
    "<rootDir>/tests/setupTests.ts"
 ],
};
