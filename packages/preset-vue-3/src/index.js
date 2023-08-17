import { VueLoaderPlugin } from 'vue-loader';

/**
 * Vue preset.
 * @returns {import('./index').Preset}
 */
export function vue() {
  return {
    name: 'vue',
    async handler(config, { extendWebpack }) {
      await extendWebpack(config, async (webpackConfig) => {
        const vueLoader = {
          loader: 'vue-loader',
          options: {
            reactivityTransform: true,
            experimentalInlineMatchResource: true,
          },
        };

        webpackConfig.module.rules.push(
          {
            test: /\.vue$/,
            use: vueLoader,
          },
          {
            test: /\.svg$/i,
            resourceQuery(input) {
              return input.includes('as-vue-component');
            },
            use: [vueLoader, 'vue-svg-loader'],
          }
        );

        webpackConfig.plugins.push(new VueLoaderPlugin());
      });
    },
  };
}

export default vue;
