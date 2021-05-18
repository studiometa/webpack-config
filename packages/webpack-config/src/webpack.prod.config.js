const { merge } = require('webpack-merge');
const getBaseConfig = require('./webpack.base.config');

module.exports = (config) => {
  const baseConfig = getBaseConfig(config);

  const prodConfig = merge(baseConfig, {
    mode: 'production',
  });

  if (config.webpackProd && typeof config.webpackProd === 'function') {
    config.webpackProd(prodConfig);
  }

  return prodConfig;
};
