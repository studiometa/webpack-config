/**
 * Extends the `webpack` configuration property while.
 * @param {Object}   config The meta config object.
 * @param {Function} fn     The function to apply.
 */
module.exports = (config, fn) => {
  const oldWebpackConfig = typeof config.webpack === 'function' ? config.webpack : () => {};

  config.webpack = (webpackConfig, isDev) => {
    fn(webpackConfig, isDev);
    oldWebpackConfig(webpackConfig, isDev);
  };
};
