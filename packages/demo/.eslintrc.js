module.exports = {
  root: true,
  extends: ['@studiometa/eslint-config'],
  rules: {
    'import/extensions': ['error', 'always', { ignorePackages: false }],
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
