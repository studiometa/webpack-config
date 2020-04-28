const webpack = require('webpack');

module.exports = () => {
  process.env.NODE_ENV = 'production';
  const webpackConfig = require('./webpack.prod.config.js');
  webpack(webpackConfig, (err, stats) => {
    console.log(
      stats.toString({
        ...webpackConfig.stats,
        colors: true,
      })
    );
  });
};
