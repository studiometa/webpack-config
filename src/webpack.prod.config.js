const { merge } = require('webpack-merge');

module.exports = (config) => {
  const baseConfig = require('./webpack.base.config')(config);

  const prodConfig = merge(baseConfig, {
    mode: 'production',
    cache: false,
  });

  if (config.webpackProd && typeof config.webpackProd === 'function') {
    config.webpackProd(prodConfig);
  }

  return prodConfig;
};
