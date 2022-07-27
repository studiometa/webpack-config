import { VueLoaderPlugin } from 'vue-loader';

/**
 * Vue preset.
 * @returns {import('./index').Preset}
 */
export default function vue() {
  return {
    name: 'vue',
    async handler(config, { extendWebpack, isDev }) {
      await extendWebpack(config, async (webpackConfig) => {
        // Do vue2 stuff here
        webpackConfig.module.rules.push(
          {
            test: /\.vue$/,
            use: isDev ? ['vue-loader', 'webpack-module-hot-accept'] : ['vue-loader'],
          },
          {
            test: /\.svg$/i,
            resourceQuery(input) {
              return input.includes('as-vue-component');
            },
            use: isDev ? ['vue-svg-loader', 'webpack-module-hot-accept'] : ['vue-svg-loader'],
          }
        );

        webpackConfig.plugins.push(new VueLoaderPlugin());
      });
    },
  };
}
