import type { Options as EslintOptions } from 'eslint-webpack-plugin';
import type { Options as StylelintOptions } from 'stylelint-webpack-plugin';
import type { LoadOptions as YamlLoaderOptions } from 'js-yaml';
import type { MetaConfig } from '../index.js';
import extendWebpackConfig from '../utils/extend-webpack-config.js';
import extendBrowsersyncConfig from '../utils/extend-browsersync-config.js';

export type Preset = {
  name: string;
  handler(
    config: MetaConfig,
    utils: {
      extendWebpack: typeof extendWebpackConfig;
      extendBrowsersync: typeof extendBrowsersyncConfig;
      isDev: boolean;
    },
  ): Promise<void>;
};

export type TailwindcssOptions = {
  path: string;
  configViewerPath: string;
};

export type YamlOptions = {
  loaderOptions?: YamlLoaderOptions;
};

export function eslint(options?: EslintOptions): Preset;
export function hash(): Preset;
export function https(): Preset;
export function stylelint(options?: StylelintOptions): Preset;
export function tailwindcss(options?: TailwindcssOptions): Preset;
export function yaml(options?: YamlOptions): Preset;

export { EslintOptions, StylelintOptions };
