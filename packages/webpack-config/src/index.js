import getMetaConfig from './utils/get-config.js';
import getWebpackProdConfig from './webpack.prod.config.js';
import getWebpackDevConfig from './webpack.dev.config.js';

/**
 * Create a configuration.
 *
 * @param  {MetaConfig} config
 * @return {MetaConfig}
 */
export function createConfig(config) {
  return config;
}

/**
 * Get the generated Webpack configuration.
 *
 * @param {Object} options
 * @param {'production'|'development'} [options.mode]
 *
 * @return {import('webpack').Configuration}
 */
export function getWebpackConfig({ mode } = { mode: process.env.NODE_ENV }) {
  const config = getMetaConfig();
  return mode === 'production' ? getWebpackProdConfig(config) : getWebpackDevConfig(config);
}
