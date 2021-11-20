import webpackMerge from 'webpack-merge';
import getWebpackConfig from './webpack.base.config.js';

export default async (config, options) => {
  const baseConfig = await getWebpackConfig(config, options);

  const prodConfig = webpackMerge.merge(baseConfig, {
    mode: 'production',
  });

  if (config.webpackProd && typeof config.webpackProd === 'function') {
    config.webpackProd(prodConfig);
  }

  return prodConfig;
};
