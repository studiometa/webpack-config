const webpackMerge = require('webpack-merge');

module.exports = (config) => {
  const baseConfig = require('./webpack.base.config')(config);
  return webpackMerge(baseConfig, {
    mode: 'production',
    cache: false,
  });
};
