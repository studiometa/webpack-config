import path from 'node:path';
import process from 'node:process';
import ESLintPlugin from 'eslint-webpack-plugin';
import commonDir from 'common-dir';

/**
 * ESLint plugin preset.
 * @param   {import('eslint-webpack-plugin').Options} [options]
 * @returns {import('./index').Preset}
 */
export default function eslint(options = {}) {
  return {
    name: 'eslint',
    async handler(config, { extendWebpack, isDev }) {
      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.plugins.push(
          new ESLintPlugin({
            context: commonDir(config.src),
            extensions: ['js', 'vue', 'ts'],
            fix: true,
            failOnError: !isDev,
            cache: true,
            cacheLocation: path.resolve(process.cwd(), 'node_modules/.cache/eslint'),
            ...options,
          }),
        );
      });
    },
  };
}
