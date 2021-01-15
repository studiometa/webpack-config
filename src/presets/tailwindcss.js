const merge = require('lodash.merge');
const path = require('path');
const findUp = require('find-up');
const extendWebpackConfig = require('../utils/extend-webpack-config.js');

module.exports = (config, options = {}) => {
  const configPath = path.dirname(findUp.sync('meta.config.js'));

  const opts = merge(
    {
      path: require.resolve('tailwindcss', { paths: [configPath] }),
    },
    options
  );

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
