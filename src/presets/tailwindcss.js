import { createRequire } from 'module';
import merge from 'lodash.merge';
import extendWebpackConfig from '../utils/extend-webpack-config.js';

export default async (config, options = {}) => {
  const path = await import.meta.resolve('tailwindcss/lib/cli.js');
  console.log({ path})
  const opts = merge({ path }, options);

  extendWebpackConfig(config, async (webpackConfig, isDev) => {
    const defaultPath = await import.meta.resolve('tailwindcss')
    const tailwind = opts.path ? opts.path : defaultPath;

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
