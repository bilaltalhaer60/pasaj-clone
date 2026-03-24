module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['dist', 'coverage'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
