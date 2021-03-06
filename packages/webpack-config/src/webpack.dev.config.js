const { merge } = require('webpack-merge');
const getBaseConfig = require('./webpack.base.config');

module.exports = (config) => {
  const baseConfig = getBaseConfig(config);
  const devConfig = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-source-map',
    devServer: {
      overlay: true,
      allowedHosts: [process.env.APP_HOST || process.env.APP_HOSTNAME],
      injectClient: true,
      injectHot: true,
      compress: true,
      open: true,
      quiet: true,
      noInfo: true,
      stats: 'none',
    },
    stats: false,
    optimization: { minimize: false },
    infrastructureLogging: {
      level: 'none',
    },
  });

  if (config.webpackDev && typeof config.webpackDev === 'function') {
    config.webpackDev(devConfig);
  }

  return devConfig;
};
