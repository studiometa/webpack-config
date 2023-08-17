import { defineConfig } from '@studiometa/webpack-config';
import { eslint, stylelint, https } from '@studiometa/webpack-config/presets';
import { prototyping } from '@studiometa/webpack-config-preset-prototyping';
import { vue } from '@studiometa/webpack-config-preset-vue-3';

export default defineConfig({
  presets: [
    (isDev) => (isDev ? null : eslint({ fix: false })),
    (isDev) => (isDev ? null : stylelint({ fix: false })),
    prototyping({ ts: true }),
    vue(),
    (isDev) => (isDev ? https() : null),
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
  webpack(config) {
    // config.cache = false;
  },
});
