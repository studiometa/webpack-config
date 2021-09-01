import { createConfig } from '@studiometa/webpack-config';

export default createConfig({
  presets: ['prototyping', 'yaml'],
  // Exclude the `test.scss` file from the merge
  mergeCSS: /^(?!.*css\/test\.scss).*$/,
  modern: true,
  legacy: true,
});
