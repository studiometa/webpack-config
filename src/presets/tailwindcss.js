const merge = require('lodash.merge');

module.exports = (options, config) => {
  const opts = merge(
    {
      entry: require.resolve('tailwindcss'),
    },
    options
  );

  const oldWebpackConfig = typeof config.webpack === 'function' ? config.webpack : () => {};
  config.webpack = (webpackConfig, isDev) => {
    const tailwind = opts.entry ? opts.entry : require.resolve('tailwindcss');

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
      if (!(Array.isArray(rule.use) && rule.use.includes('postcss-loader'))) {
        return;
      }

      const postcssIndex = rule.use.findIndex((use) => use === 'postcss-loader');
      rule.use[postcssIndex] = postcssLoader;
    });

    oldWebpackConfig(webpackConfig, isDev);
  };
};
