export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.app.json', useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^firebase/app$': '<rootDir>/node_modules/firebase/app/dist/index.cjs.js',
    '^firebase/auth$': '<rootDir>/node_modules/@firebase/auth/dist/node/index.js',
    '^firebase/firestore$': '<rootDir>/node_modules/firebase/firestore/dist/index.cjs.js',
    '^firebase/storage$': '<rootDir>/node_modules/firebase/storage/dist/index.cjs.js',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/utils/formatCurrency.ts',
    'src/store/cartStore.ts',
    'src/store/authStore.ts',
    'src/routes/ProtectedRoute.tsx',
    'src/routes/AdminRoute.tsx',
    'src/app/page-shell.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
