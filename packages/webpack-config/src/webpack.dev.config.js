import * as webpackMerge from 'webpack-merge';
import getWebpackConfig from './webpack.base.config.js';

/**
 * Get Webpack dev config.
 * @param   {import('./index').MetaConfig} config Meta config.
 * @returns {import('webpack').Configuration}
 */
export default async function getWebpackDevConfig(config) {
  const baseConfig = await getWebpackConfig(config, { mode: 'development' });
  const devConfig = webpackMerge.merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
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
}
