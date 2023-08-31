/** @type {import('jest').Config} */
const config = {
  rootDir: '.',
  transformIgnorePatterns: [],
  testMatch: ['<rootDir>/tests/*.test.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

module.exports = config
