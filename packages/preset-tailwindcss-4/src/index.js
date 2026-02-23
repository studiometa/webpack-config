import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

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

          const postcssIndex = rule.use.findIndex(
            (loader) => loader === 'postcss-loader' || loader?.loader === 'postcss-loader',
          );

          if (postcssIndex === -1) {
            continue;
          }

          rule.use[postcssIndex] = {
            loader: require.resolve('@tailwindcss/webpack'),
            options: {
              base: config.context,
              optimize: false,
            },
          };
        }
      });
    },
  };
}
