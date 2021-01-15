import webpackMerge from 'webpack-merge';
import getWebpackConfig from './webpack.base.config.js';

export default async (config) => {
  const baseConfig = await getWebpackConfig(config);
  const devConfig = webpackMerge.merge(baseConfig, {
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

  if (config.webpackDev && typeof config.webpackDev === 'function') {
    config.webpackDev(devConfig);
  }

  return devConfig;
};
