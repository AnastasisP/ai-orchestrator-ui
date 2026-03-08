export default {
  displayName: 'client-app',
  preset: '../../jest.preset.js',
  setupFilesAfterFramework: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  coverageDirectory: '../../coverage/apps/ClientApp',
};
