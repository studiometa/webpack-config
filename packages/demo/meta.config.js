import { defineConfig } from '@studiometa/webpack-config';
import { prototyping, yaml } from '@studiometa/webpack-config/presets';
import vue from '@studiometa/webpack-config-preset-vue-3';

export default defineConfig({
  presets: [
    prototyping(),
    yaml(),
    vue(),
    {
      name: 'foo',
      handler: (metaConfig, { extendWebpack }) =>
        extendWebpack(metaConfig, async (webpackConfig) => {
          webpackConfig.optimization.minimize = false;
        }),
    },
  ],
  // Exclude the `test.scss` file from the merge
  mergeCSS: /^(?!.*css\/test\.scss).*$/,
});
