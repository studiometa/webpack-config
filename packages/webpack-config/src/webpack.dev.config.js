import webpackMerge from 'webpack-merge';
import getWebpackConfig from './webpack.base.config.js';

export default async (config) => {
  const baseConfig = await getWebpackConfig(config);
  const devConfig = webpackMerge.merge(baseConfig, {
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
