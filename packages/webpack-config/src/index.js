import getMetaConfig from './utils/get-config.js';
import getWebpackProdConfig from './webpack.prod.config.js';
import getWebpackDevConfig from './webpack.dev.config.js';

/**
 * Create a configuration.
 *
 * @deprecated Use `defineConfig` instead.
 * @template  {import('./index').MetaConfig} T
 * @param  {T} config
 * @returns {T}
 */
export function createConfig(config) {
  return config;
}

/**
 * Define the configuration.
 *
 * @template {import('./index').MetaConfig} T
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
 * @returns {import('webpack').Configuration}
 */
export function getWebpackConfig({ mode = process.env.NODE_ENV } = {}) {
  const config = getMetaConfig({ target: [target] });
  return mode === 'production'
    ? getWebpackProdConfig(config)
    : getWebpackDevConfig(config);
}
