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
 * Define the configuration.
 * @template {MetaConfig} T
 * @param   {T} config
 * @returns {T}
 */
export function defineConfig(config) {
  return config;
}

/**
 * Get the generated Webpack configuration.
 *
 * @param {Object} options
 * @param {'production'|'development'} [options.mode]
 * @param {'modern'|'legacy'} [options.target]
 *
 * @return {import('webpack').Configuration}
 */
export function getWebpackConfig(
  { mode, target } = { mode: process.env.NODE_ENV, target: 'legacy' }
) {
  const config = getMetaConfig();
  const options = { isModern: target === 'modern', isLegacy: target === 'legacy' };
  return mode === 'production'
    ? getWebpackProdConfig(config, options)
    : getWebpackDevConfig(config, options);
}
