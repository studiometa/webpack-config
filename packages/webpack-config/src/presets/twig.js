import merge from 'lodash.merge';
import extendWebpackConfig from '../utils/extend-webpack-config.js';

export default async (config, options = {}) => {
  const opts = merge({ data: {} }, options);

  await extendWebpackConfig(config, async (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.twig$/,
      use: [
        'raw-loader',
        {
          loader: 'twig-html-loader',
          options: opts,
        },
      ],
    });
  });
};
