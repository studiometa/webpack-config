const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(require('./webpack.base.config'), {
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
