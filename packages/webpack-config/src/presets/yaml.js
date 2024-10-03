import merge from 'lodash.merge';

let isUsed = false;

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
    options,
  );

  return {
    name: 'yaml',
    async handler(config, { extendWebpack }) {
      if (isUsed) {
        return;
      }

      isUsed = true;
      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.ya?ml$/,
          resourceQuery: /^(?!.*raw).*$/,
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
