/**
 * With hash preset.
 * @returns {import('./index').Preset}
 */
export default function hash() {
  return {
    name: 'hash',
    async handler(config, { extendWebpack, isDev }) {
      if (isDev) {
        return;
      }

      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.output.filename = '[name].[contenthash].js';
        const ExtractCSSPlugin = webpackConfig.plugins.find(
          (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
        );
        if (ExtractCSSPlugin) {
          ExtractCSSPlugin.options = Object.assign(ExtractCSSPlugin.options, {
            filename: '[name].[contenthash].css',
          });
        }
      });
    },
  };
}
