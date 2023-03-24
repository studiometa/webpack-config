import path from 'node:path';
import process from 'node:process';
import StylelintPlugin from 'stylelint-webpack-plugin';
import commonDir from 'common-dir';

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
            context: commonDir(config.src),
            files: ['**/*.s?(a|c)ss', '**/*.vue'],
            fix: true,
            cache: true,
            cacheLocation: path.resolve(process.cwd(), 'node_modules/.cache/'),
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
