import StylelintPlugin from 'stylelint-webpack-plugin';

/**
 * StyleLint plugin preset.
 * @param   {import('stylelint-webpack-plugin').Options} [options]
 * @returns {import('./index').Preset}
 */
export default function stylelint(options = {}) {
  return {
    name: 'stylelint',
    async handler(config, { extendWebpack, isDev }) {
      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.plugins.push(
          new StylelintPlugin({
            context: config.context,
            files: ['**/*.s?(a|c)ss', '**/*.vue'],
            fix: true,
            allowEmptyInput: true,
            failOnError: !isDev,
            configOverride: { extends: '@studiometa/stylelint-config' },
            ...options,
          })
        );
      });
    },
  };
}
