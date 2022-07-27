import merge from 'lodash.merge';

/**
 * YAML loader preset.
 * @param   {any} options
 * @returns {import('./index').Preset}
 */
export default function yaml(options = {}) {
  const opts = merge(
    {
      loaderOptions: {},
    },
    options
  );

  return {
    name: 'yaml',
    async handler(config, { extendWebpack }) {
      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.ya?ml$/,
          use: [
            {
              loader: 'js-yaml-loader',
              options: opts.loaderOptions,
            },
          ],
        });
      });
    },
  };
}
