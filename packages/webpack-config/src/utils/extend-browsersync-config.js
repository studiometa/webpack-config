/**
 * Extends the `server` configuration property.
 * @param {Object}   config The meta config object.
 * @param {Function} fn     The function to apply.
 */
export default (config, fn) => {
  const oldServerConfig =
    typeof config.server === 'function' ? config.server : () => config.server || {};

  config.server = (browserSyncConfig, instance) => {
    fn(browserSyncConfig, instance);
    oldServerConfig(browserSyncConfig, instance);
  };
};
