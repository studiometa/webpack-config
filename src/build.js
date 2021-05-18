const webpack = require('webpack');

module.exports = (options = {}) => {
  process.env.NODE_ENV = 'production';

  const config = require('./utils/get-config.js')(options);
  const webpackConfig = require('./webpack.prod.config.js')(config);

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