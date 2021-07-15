const extendWebpackConfig = require('../utils/extend-webpack-config');

module.exports = (config) => {
  extendWebpackConfig(config, (webpackConfig, isDev) => {
    if (!isDev) {
      webpackConfig.output.filename = '[name].[contenthash].js';

      const MiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (MiniCssExtractPlugin) {
        MiniCssExtractPlugin.options = Object.assign(MiniCssExtractPlugin.options, {
          filename: '[name].[contenthash].css',
        });
      }
    }
  });
};
