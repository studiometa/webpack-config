import webpack from 'webpack';
import getMetaConfig from './utils/get-config.js';
import getWebpackProdConfig from './webpack.prod.config.js';
import getWebpackDevConfig from './webpack.dev.config.js';

const {
  AutomaticPrefetchPlugin: WebpackAutomaticPrefetchPlugin,
  BannerPlugin: WebpackBannerPlugin,
  CleanPlugin: WebpackCleanPlugin,
  ContextExclusionPlugin: WebpackContextExclusionPlugin,
  ContextReplacementPlugin: WebpackContextReplacementPlugin,
  DefinePlugin: WebpackDefinePlugin,
  DelegatedPlugin: WebpackDelegatedPlugin,
  DllPlugin: WebpackDllPlugin,
  DllReferencePlugin: WebpackDllReferencePlugin,
  DynamicEntryPlugin: WebpackDynamicEntryPlugin,
  EntryOptionPlugin: WebpackEntryOptionPlugin,
  EntryPlugin: WebpackEntryPlugin,
  EnvironmentPlugin: WebpackEnvironmentPlugin,
  EvalDevToolModulePlugin: WebpackEvalDevToolModulePlugin,
  EvalSourceMapDevToolPlugin: WebpackEvalSourceMapDevToolPlugin,
  ExternalsPlugin: WebpackExternalsPlugin,
  HotModuleReplacementPlugin: WebpackHotModuleReplacementPlugin,
  IgnorePlugin: WebpackIgnorePlugin,
  LibManifestPlugin: WebpackLibManifestPlugin,
  LoaderOptionsPlugin: WebpackLoaderOptionsPlugin,
  LoaderTargetPlugin: WebpackLoaderTargetPlugin,
  NoEmitOnErrorsPlugin: WebpackNoEmitOnErrorsPlugin,
  NormalModuleReplacementPlugin: WebpackNormalModuleReplacementPlugin,
  PrefetchPlugin: WebpackPrefetchPlugin,
  ProgressPlugin: WebpackProgressPlugin,
  ProvidePlugin: WebpackProvidePlugin,
  SourceMapDevToolPlugin: WebpackSourceMapDevToolPlugin,
  WatchIgnorePlugin: WebpackWatchIgnorePlugin,
} = webpack;

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
  return mode === 'production' ? getWebpackProdConfig(config) : getWebpackDevConfig(config);
}

export {
  WebpackAutomaticPrefetchPlugin,
  WebpackBannerPlugin,
  WebpackCleanPlugin,
  WebpackContextExclusionPlugin,
  WebpackContextReplacementPlugin,
  WebpackDefinePlugin,
  WebpackDelegatedPlugin,
  WebpackDllPlugin,
  WebpackDllReferencePlugin,
  WebpackDynamicEntryPlugin,
  WebpackEntryOptionPlugin,
  WebpackEntryPlugin,
  WebpackEnvironmentPlugin,
  WebpackEvalDevToolModulePlugin,
  WebpackEvalSourceMapDevToolPlugin,
  WebpackExternalsPlugin,
  WebpackHotModuleReplacementPlugin,
  WebpackIgnorePlugin,
  WebpackLibManifestPlugin,
  WebpackLoaderOptionsPlugin,
  WebpackLoaderTargetPlugin,
  WebpackNoEmitOnErrorsPlugin,
  WebpackNormalModuleReplacementPlugin,
  WebpackPrefetchPlugin,
  WebpackProgressPlugin,
  WebpackProvidePlugin,
  WebpackSourceMapDevToolPlugin,
  WebpackWatchIgnorePlugin,
};
