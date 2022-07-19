import { defineConfig } from '@studiometa/webpack-config';
import { prototyping, yaml, vue2 } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [
    prototyping(),
    yaml(),
    vue2(),
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
