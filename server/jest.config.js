module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Один воркер — общая тестовая БД, без гонок между auth и levels
  maxWorkers: 1,
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/__tests__/**',
  ],
};
