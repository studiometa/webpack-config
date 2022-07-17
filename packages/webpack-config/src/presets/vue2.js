import VueLoaderPlugin from 'vue-loader/lib/plugin.js';
import extendWebpackConfig from '../utils/extend-webpack-config.js';

export default async function vue2(config) {
  const isDev = process.env.NODE_ENV !== 'production';

  await extendWebpackConfig(config, async (webpackConfig) => {
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
        use: ['vue-svg-loader'],
      }
    );

    webpackConfig.plugins.push(new VueLoaderPlugin());
  });
}
