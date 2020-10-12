const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('lodash.merge');
const extendWebpackConfig = require('../utils/extend-webpack-config.js');

module.exports = (config, options = {}) => {
  const opts = merge(
    {
      loaderOptions: { data: {} },
      pluginOptions: { template: './src/templates/index.twig' },
    },
    options
  );

  extendWebpackConfig(config, (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.twig$/,
      use: [
        'raw-loader',
        {
          loader: 'twig-html-loader',
          options: opts.loaderOptions,
        },
      ],
    });
    webpackConfig.plugins.push(new HtmlWebpackPlugin(opts.pluginOptions));
  });
};
