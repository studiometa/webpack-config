import webpackMerge from 'webpack-merge';
import getWebpackConfig from './webpack.base.config.js';

/**
 * Get Webpack prod config.
 * @param   {import('./index').MetaConfig} config
 * @param   {{ isModern?: boolean, isLegacy?: boolean }} [options]
 * @returns {import('webpack').Configuration}
 */
export default async function getWebpackProdConfig(config, options = {}) {
  const baseConfig = await getWebpackConfig(config, options);

  const prodConfig = webpackMerge.merge(baseConfig, {
    mode: 'production',
  });

  if (config.webpackProd && typeof config.webpackProd === 'function') {
    config.webpackProd(prodConfig);
  }

  return prodConfig;
}
