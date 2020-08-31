const { merge } = require('webpack-merge');

module.exports = (config) => {
  const baseConfig = require('./webpack.base.config')(config);
  return merge(baseConfig, {
    mode: 'production',
    cache: false,
  });
};
