import ESLintPlugin from 'eslint-webpack-plugin';

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
            context: config.context,
            extensions: ['js', 'vue', 'ts'],
            fix: true,
            failOnError: !isDev,
            baseConfig: {
              extends: '@studiometa/eslint-config',
              globals: {
                __DEV__: false,
              },
            },
            ...options,
          })
        );
      });
    },
  };
}
