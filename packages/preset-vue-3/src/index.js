import merge from 'lodash.merge';
import { VueLoaderPlugin } from 'vue-loader';

/**
 * Vue preset.
 * @param   {import('./index').VuePresetOptions} [options]
 * @returns {import('./index').Preset}
 */
export function vue(options = {}) {
  const opts = merge(options, {
    vue: {
      reactivityTransform: true,
      experimentalInlineMatchResource: true,
    },
    svgo: {
      plugins: [{ prefixIds: true }, { removeViewBox: false }],
    },
  });

  return {
    name: 'vue',
    async handler(config, { extendWebpack }) {
      await extendWebpack(config, async (webpackConfig) => {
        const vueLoader = {
          loader: 'vue-loader',
          options: opts.vue,
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
            use: [
              vueLoader,
              {
                loader: 'vue-svg-loader',
                options: {
                  svgo: opts.svgo,
                },
              },
            ],
          },
        );

        webpackConfig.plugins.push(new VueLoaderPlugin());
      });
    },
  };
}

export default vue;
