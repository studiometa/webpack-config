import merge from 'lodash.merge';
import extendWebpackConfig from '../utils/extend-webpack-config.js';

export default async (config, options = {}) => {
  const opts = merge(
    {
      loaderOptions: {},
    },
    options
  );

  await extendWebpackConfig(config, async (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.ya?ml$/,
      use: [
        {
          loader: 'js-yaml-loader',
          options: opts.loaderOptions,
        },
      ],
    });
  });
};
