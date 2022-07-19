import merge from 'lodash.merge';

/**
 * Twig preset.
 * @param   {{ data: Record<string, any> }} [options]
 * @returns {(config:WebpackConfig)=>Promise<void>}
 */
export default function twig(options = {}) {
  return {
    name: 'twig',
    async handler(config, { extendWebpack }) {
      const opts = merge({ data: {} }, options);

      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.twig$/,
          use: [
            'raw-loader',
            {
              loader: 'twig-html-loader',
              options: opts,
            },
          ],
        });
      });
    },
  };
}
