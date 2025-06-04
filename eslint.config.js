import { defineConfig, js, prettier, globals } from '@studiometa/eslint-config';

export default defineConfig(
  js,
  prettier,
  {
    files: ['packages/preset-*/**/*', 'packages/webpack-config/**/*'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ['**/dist/**'],
  },
);
