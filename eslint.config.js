import { js, prettier } from '@studiometa/eslint-config';
import { globals } from '@studiometa/eslint-config/utils';

export default [
  ...js,
  ...prettier,
  {
    files: ['packages/preset-*/**/*', 'packages/webpack-config/**/*'],
    languageOptions: {
      globals: globals.node,
    },
  },
];
