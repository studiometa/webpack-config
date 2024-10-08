import {
  Configuration as WebpackConfig,
  ChunkGraph,
  Module,
  ModuleGraph,
  AutomaticPrefetchPlugin as WebpackAutomaticPrefetchPlugin,
  BannerPlugin as WebpackBannerPlugin,
  CleanPlugin as WebpackCleanPlugin,
  ContextExclusionPlugin as WebpackContextExclusionPlugin,
  ContextReplacementPlugin as WebpackContextReplacementPlugin,
  DefinePlugin as WebpackDefinePlugin,
  DelegatedPlugin as WebpackDelegatedPlugin,
  DllPlugin as WebpackDllPlugin,
  DllReferencePlugin as WebpackDllReferencePlugin,
  DynamicEntryPlugin as WebpackDynamicEntryPlugin,
  EntryOptionPlugin as WebpackEntryOptionPlugin,
  EntryPlugin as WebpackEntryPlugin,
  EnvironmentPlugin as WebpackEnvironmentPlugin,
  EvalDevToolModulePlugin as WebpackEvalDevToolModulePlugin,
  EvalSourceMapDevToolPlugin as WebpackEvalSourceMapDevToolPlugin,
  ExternalsPlugin as WebpackExternalsPlugin,
  HotModuleReplacementPlugin as WebpackHotModuleReplacementPlugin,
  IgnorePlugin as WebpackIgnorePlugin,
  LibManifestPlugin as WebpackLibManifestPlugin,
  LoaderOptionsPlugin as WebpackLoaderOptionsPlugin,
  LoaderTargetPlugin as WebpackLoaderTargetPlugin,
  NoEmitOnErrorsPlugin as WebpackNoEmitOnErrorsPlugin,
  NormalModuleReplacementPlugin as WebpackNormalModuleReplacementPlugin,
  PrefetchPlugin as WebpackPrefetchPlugin,
  ProgressPlugin as WebpackProgressPlugin,
  ProvidePlugin as WebpackProvidePlugin,
  SourceMapDevToolPlugin as WebpackSourceMapDevToolPlugin,
  WatchIgnorePlugin as WebpackWatchIgnorePlugin,
} from 'webpack';
import {
  ServerOptions,
  Options as BrowsersyncOptions,
  BrowserSyncInstance,
} from '@types/browser-sync';
import type { Preset } from './presets/index.js';

interface CacheGroupsContext {
  moduleGraph: ModuleGraph;
  chunkGraph: ChunkGraph;
}

export * from './presets/index.js';

export interface MetaConfig {
  /**
   * A list of glob for files to consider as entries.
   */
  src?: string[];
  /**
   * The path to the dist folder.
   */
  dist?: string;
  /**
   * The absolute public path of the generated dist folder.
   */
  public?: string;
  /**
   * Base path for path resolution.
   */
  context?: string;
  /**
   * Analyze the bundle with the WebpackBundleAnalyzer plugin.
   */
  analyze?: boolean;
  /**
   * Do we merge all initial CSS chunks? Use a RegExp or a function to exclude some files.
   *
   * @exampe Exclude files matching the `css/do-not-merge.scss` pattern:
   *
   * ```js
   * mergeCSS: /^(?!.*css\/do-not-merge\.scss).*$/,
   * ```
   */
  mergeCSS?: boolean | RegExp | ((module: Module, chunk: CacheGroupsContext) => boolean);
  /**
   * Extends the Webpack configuration before merging
   * with the environment specific configurations.
   */
  webpack?: (config: WebpackConfig, isDev: boolean) => void;
  /**
   * Extends the development Webpack configuration.
   */
  webpackDev?: (config: WebpackConfig) => void;
  /**
   * Extends the production Webpack configuration.
   */
  webpackProd?: (config: WebpackConfig) => void;
  /**
   * Configure the `sass-loader` options.
   * @link https://github.com/webpack-contrib/sass-loader#sassoptions
   */
  sassOptions?: Object;
  /**
   * Configure the browserSync server if you do not use a proxy by setting
   * this property to `true` or a BrowserSync server configuration object.
   * If the property is a function, it will be used to alter the server
   * configuraton and instance in proxy mode.
   * @link https://browsersync.io/docs/options#option-server
   */
  server?:
    | string
    | boolean
    | string[]
    | ServerOptions
    | ((config: BrowsersyncOptions, bs: BrowserSyncInstance) => void);
  /**
   * Watch for file changes in dev mode and:
   *
   * - reload the browser
   * - or execute a callback
   *
   * @example
   * ```js
   * watch: [
   *   // Watch for changes on all PHP files and reload the browser
   *   '*.php',
   *   // Watch for all events on all HTML files and execute the callback
   *   [
   *     '*.html',
   *     (event, file, bs) => event === 'change' && bs.reload(),
   *   ],
   * ],
   * ```
   *
   * @link https://browsersync.io/docs/api#api-watch
   */
  watch?: Array<
    | string
    | [
        string,
        (
          event: string,
          file: string,
          bs: BrowserSyncInstance,
          bsConfig: BrowsersyncOptions,
        ) => void,
      ]
  >;
  /**
   * Use presets to apply pre-made configurations.
   * The following presets are available:
   *
   * - `prototyping` ([doc](https://github.com/studiometa/webpack-config#prototyping))
   * - `tailwindcss` ([doc](https://github.com/studiometa/webpack-config#tailwindcss))
   * - `yaml` ([doc](https://github.com/studiometa/webpack-config#yaml))
   * - `twig` ([doc](https://github.com/studiometa/webpack-config#twig))
   */
  presets?: Array<Preset | (() => Preset)>;
}

/**
 * Generate a configuration object for the meta CLI.
 */
declare function defineConfig(config: MetaConfig): MetaConfig;

/**
 * Get the generated Webpack configuration.
 */
declare function getWebpackConfig(options: { mode?: 'production' | 'development' }): WebpackConfig;

export {
  defineConfig,
  getWebpackConfig,
  Preset,
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
