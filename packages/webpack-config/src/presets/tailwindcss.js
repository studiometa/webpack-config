const merge = require('lodash.merge');
const findUp = require('find-up');
const chalk = require('chalk');
const createServer = require('tailwind-config-viewer/server');
const extendWebpackConfig = require('../utils/extend-webpack-config.js');
const extendBrowserSyncConfig = require('../utils/extend-browsersync-config.js');
const { withTrailingSlash, withoutTrailingSlash, withLeadingSlash } = require('../utils');

module.exports = (config, options = {}) => {
  const configPath = config.PATH;

  const opts = merge(
    {
      path: require.resolve('tailwindcss', { paths: [configPath] }),
      configViewerPath: '/_tailwind',
    },
    options
  );

  if (process.env.NODE_ENV === 'development') {
    extendBrowserSyncConfig(config, (bsConfig) => {
      const tailwindConfigViewerServer = createServer({
        // eslint-disable-next-line import/no-dynamic-require
        tailwindConfigProvider: () => require(findUp.sync('tailwind.config.js')),
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

  extendWebpackConfig(config, (webpackConfig, isDev) => {
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
          plugins: isDev ? [tailwind] : [tailwind, 'autoprefixer', 'cssnano'],
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
};
