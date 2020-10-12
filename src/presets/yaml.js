const merge = require('lodash.merge');
const extendWebpackConfig = require('../utils/extend-webpack-config.js');

module.exports = (config, options = {}) => {
  const opts = merge(
    {
      loaderOptions: {},
    },
    options
  );

  extendWebpackConfig(config, (webpackConfig) => {
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
