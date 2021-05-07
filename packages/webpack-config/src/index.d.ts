import { Configuration as WebpackConfig } from 'webpack';
import {
  ServerOptions,
  Options as BrowsersyncOptions,
  BrowserSyncInstance,
} from '@types/browser-sync';

export type Presets = 'prototyping' | 'tailwindcss' | 'twig' | 'yaml';

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
   * Analyze the bundle with the WebpackBundleAnalyzer plugin.
   */
  analyze?: boolean;
  /**
   * Do we merge all initial CSS chunks?
   */
  mergeCSS?: boolean;
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
  watch: Array<
    | string
    | [
        string,
        (event: string, file: string, bs: BrowserSyncInstance, bsConfig: BrowsersyncOptions) => void
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
  presets?: Array<Presets | [Presets, any]>;
}

/**
 * Generate a configuration object for the meta CLI.
 */
declare function createConfig(config: MetaConfig): MetaConfig;

/**
 * Get the generated Webpack configuration.
 */
declare function getWebpackConfig(): WebpackConfig;

export { createConfig, getWebpackConfig };
