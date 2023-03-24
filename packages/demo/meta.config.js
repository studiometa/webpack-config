import { defineConfig } from '@studiometa/webpack-config';
import {
  prototyping,
  tailwindcss,
  yaml,
  eslint,
  stylelint,
  https,
  hash,
} from '@studiometa/webpack-config/presets';
// import vue from '@studiometa/webpack-config-preset-vue-3';

export default defineConfig({
  src: ['./src/js/app.ts', './src/css/*.scss'],
  dist: './dist',
  presets: [
    // (isDev) => (isDev ? null : eslint({ fix: false })),
    // (isDev) => (isDev ? null : stylelint({ fix: false })),
    prototyping({ ts: true }),
    // yaml(),
    // vue(),
    https(),
    {
      name: 'foo',
      handler: (metaConfig, { extendWebpack }) =>
        extendWebpack(metaConfig, async (webpackConfig) => {
          // webpackConfig.optimization.minimize = false;
        }),
    },
  ],
  // Exclude the `test.scss` file from the merge
  mergeCSS: /^(?!.*css\/test\.scss).*$/,
});
