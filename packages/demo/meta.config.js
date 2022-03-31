import { defineConfig } from '@studiometa/webpack-config';

export default defineConfig({
  presets: ['prototyping', 'yaml', './meta.config.foo.js'],
  // Exclude the `test.scss` file from the merge
  mergeCSS: /^(?!.*css\/test\.scss).*$/,
});
