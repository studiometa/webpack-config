/**
 * @typedef {import('../index').MetaConfig} MetaConfig
 * @typedef {import('@types/browser-sync').Options} BrowsersyncOptions
 * @typedef {import('@types/browser-sync').BrowserSyncInstance} BrowserSyncInstance
 */

/**
 * Extends the `server` configuration property.
 *
 * @param {MetaConfig} config
 * @param {(config:BrowsersyncOptions, instance:BrowserSyncInstance)=> void} fn
 */
export default (config, fn) => {
  const oldServerConfig =
    typeof config.server === 'function' ? config.server : () => config.server || {};

  config.server = (browserSyncConfig, instance) => {
    fn(browserSyncConfig, instance);
    oldServerConfig(browserSyncConfig, instance);
  };
};
