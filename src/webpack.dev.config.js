const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

process.env.NODE_ENV = 'development';

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  cache: true,
  devtool: 'cheap-eval-source-map',
  devServer: {
    overlay: true,
    allowedHosts: [process.env.APP_HOST],
    injectClient: true,
    injectHot: true,
    compress: true,
    open: true,
    quiet: true,
  },
  optimization: { minimize: false },
});
