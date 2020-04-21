module.exports = {
  extends: '@studiometa/eslint-config',
  rules: {
    'global-require': 'off',
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
