import merge from 'lodash.merge';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * Tailwind CSS preset.
 * @param   {{ path: string, configViewerPath: string }} options
 * @returns {import('./index').Preset}
 */
export default function tailwindcss(options = {}) {
  return {
    name: 'tailwindcss',
    async handler(config, { extendWebpack, isDev }) {
      const configPath = config.PATH;

      const opts = merge(
        {
          path: require.resolve('tailwindcss', { paths: [configPath] }),
          configViewerPath: '/_tailwind',
        },
        options,
      );

      await extendWebpack(config, async (webpackConfig) => {
        const tailwind = opts.path
          ? opts.path
          : require.resolve('tailwindcss', { paths: [configPath] });

        // Strange bug where wrong resolution trigger the CLI from Tailwind
        // instead of the index file containing the PostCSS plugin.
        if (!tailwind.endsWith('tailwindcss/lib/index.js')) {
          throw new Error('You have to install tailwindcss. Try `npm i -D tailwindcss`.');
        }

        const postcssLoader = {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: isDev ? [tailwind] : [tailwind, 'autoprefixer'],
            },
          },
        };

        webpackConfig.module.rules.forEach((rule) => {
          if (!Array.isArray(rule.use)) {
            return;
          }

          const postcssIndex = rule.use.findIndex(
            (use) => use === 'postcss-loader' || use.loader === 'postcss-loader',
          );

          if (postcssIndex > -1) {
            rule.use[postcssIndex] = postcssLoader;
          }
        });
      });
    },
  };
}
