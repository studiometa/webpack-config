import tailwindcssPlugin from '@tailwindcss/postcss';

/**
 * Tailwind CSS preset.
 * @returns {import('./index').Preset}
 */
export function tailwindcss() {
  return {
    name: 'tailwindcss-4',
    async handler(config, { extendWebpack }) {
      await extendWebpack(config, async (webpackConfig) => {
        for (const rule of webpackConfig.module.rules) {
          if (!rule.type?.startsWith('css')) {
            continue;
          }

          for (const loader of rule.use) {
            if (loader.loader === 'postcss-loader') {
              loader.options.postcssOptions.plugins = [
                tailwindcssPlugin({
                  optimize: false,
                }),
                ...loader.options.postcssOptions.plugins,
              ];
            }
          }
        }
      });
    },
  };
}
