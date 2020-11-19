const merge = require('lodash.merge');
const extendWebpackConfig = require('../utils/extend-webpack-config.js');

module.exports = (config, options = {}) => {
  const opts = merge({ data: {} }, options);

  extendWebpackConfig(config, (webpackConfig) => {
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
