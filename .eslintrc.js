module.exports = {
  extends: '@studiometa/eslint-config',
  rules: {
    'global-require': 'off',
    'import/extensions': ['error', 'always', { ignorePackages: false }],
  },
  overrides: [
    {
      files: 'readme.md',
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
};
