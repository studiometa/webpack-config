const { merge } = require('webpack-merge');

module.exports = (config) => {
  const baseConfig = require('./webpack.base.config')(config);
  return merge(baseConfig, {
    mode: 'development',
    cache: true,
    devtool: 'cheap-eval-source-map',
    devServer: {
      overlay: true,
      allowedHosts: [process.env.APP_HOST || process.env.APP_HOSTNAME],
      injectClient: true,
      injectHot: true,
      compress: true,
      open: true,
      quiet: true,
    },
    optimization: { minimize: false },
  });
};
