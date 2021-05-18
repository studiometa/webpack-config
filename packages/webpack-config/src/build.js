const webpack = require('webpack');
const getMetaConfig = require('./utils/get-config.js');
const getWebpackConfig = require('./webpack.prod.config.js');

module.exports = (options = {}) => {
  process.env.NODE_ENV = 'production';

  const config = getMetaConfig(options);
  const webpackConfig = getWebpackConfig(config);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(
      stats.toString({
        ...webpackConfig.stats,
        colors: true,
      })
    );
  });
};
