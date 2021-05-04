const { merge } = require('webpack-merge');

module.exports = (config) => {
  const baseConfig = require('./webpack.base.config')(config);

  const prodConfig = merge(baseConfig, {
    mode: 'production',
  });

  if (config.webpackProd && typeof config.webpackProd === 'function') {
    config.webpackProd(prodConfig);
  }

  return prodConfig;
};
