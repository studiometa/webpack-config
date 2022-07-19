import merge from 'lodash.merge';
import { findUpSync } from 'find-up';
import chalk from 'chalk';
import createServer from 'tailwind-config-viewer/server/index.js';
import { createRequire } from 'module';
import { withTrailingSlash, withoutTrailingSlash, withLeadingSlash } from '../utils/index.js';

const require = createRequire(import.meta.url);

/**
 * Tailwind CSS preset.
 * @param   {{ path: string, configViewerPath: string }} options
 * @returns {(config:WebpackConfig)=>Promise<void>}
 */
export default function tailwindcss(options = {}) {
  return {
    name: 'tailwindcss',
    async handler(config, { extendWebpack, extendBrowsersync }) {
      const configPath = config.PATH;

      const opts = merge(
        {
          path: require.resolve('tailwindcss', { paths: [configPath] }),
          configViewerPath: '/_tailwind',
        },
        options
      );

      if (process.env.NODE_ENV === 'development') {
        await extendBrowsersync(config, async (bsConfig) => {
          const tailwindConfigViewerServer = createServer({
            tailwindConfigProvider: () =>
              // eslint-disable-next-line import/no-dynamic-require
              require(findUpSync(['tailwind.config.js', 'tailwind.config.cjs'])),
          }).asMiddleware();

          bsConfig.middleware = bsConfig.middleware || [];
          bsConfig.middleware.push({
            route: withLeadingSlash(withoutTrailingSlash(opts.configViewerPath)),
            handle: tailwindConfigViewerServer,
          });

          bsConfig.infos = bsConfig.infos || [];
          bsConfig.infos.push(
            (url) =>
              `Tailwind Viewer runnning at ${chalk.blue(
                withTrailingSlash(url + opts.configViewerPath)
              )}`
          );
        });
      }

      await extendWebpack(config, async (webpackConfig, isDev) => {
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
            (use) => use === 'postcss-loader' || use.loader === 'postcss-loader'
          );

          if (postcssIndex > -1) {
            rule.use[postcssIndex] = postcssLoader;
          }
        });
      });
    },
  };
}
