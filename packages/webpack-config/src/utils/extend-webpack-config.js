/**
 * @typedef {import('../index').MetaConfig} MetaConfig
 * @typedef {import('webpack').Configuration} WebpackConfig
 */

/**
 * Extends the `webpack` configuration property.
 * @param {MetaConfig}   config
 * @param {(config:WebpackConfig, isDev: boolean) => Promise<void>} fn
 */
export default async function extendWebpackConfig(config, fn) {
  // eslint-disable-next-line no-empty-function
  const oldWebpackConfig = typeof config.webpack === 'function' ? config.webpack : () => {};

  config.webpack = async (webpackConfig, isDev) => {
    await oldWebpackConfig(webpackConfig, isDev);
    await fn(webpackConfig, isDev);
  };
}
