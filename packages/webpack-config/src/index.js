import getMetaConfig from './utils/get-config.js';
import getWebpackProdConfig from './webpack.prod.config.js';

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
 * @return {import('webpack').Configuration}
 */
export function getWebpackConfig() {
  const config = getMetaConfig();
  return getWebpackProdConfig(config);
}
