/**
 * Extends the `webpack` configuration property while.
 * @param {Object}   config The meta config object.
 * @param {Function} fn     The function to apply.
 */
export default async (config, fn) => {
  const oldWebpackConfig = typeof config.webpack === 'function' ? config.webpack : () => {};

  config.webpack = async (webpackConfig, isDev) => {
    await fn(webpackConfig, isDev);
    await oldWebpackConfig(webpackConfig, isDev);
  };
};
