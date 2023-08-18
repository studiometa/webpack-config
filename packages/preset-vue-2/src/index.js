import { VueLoaderPlugin } from 'vue-loader';

/**
 * Vue preset.
 * @returns {import('@studiometa/webpack-config').Preset}
 */
export function vue() {
  return {
    name: 'vue',
    async handler(config, { extendWebpack }) {
      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.module.rules.push(
          {
            test: /\.vue$/,
            use: 'vue-loader',
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
    },
  };
}

export default vue;
