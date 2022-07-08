/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src/',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'], 
  moduleNameMapper: {
    '^@constants/(.*)$': '<rootDir>/constants/$1',
    '^@declarations/(.*)$': '<rootDir>/declarations/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  },
};
