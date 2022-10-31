import type { MetaConfig } from '../index.js';
import extendWebpackConfig from '../utils/extend-webpack-config.js';
import extendBrowsersyncConfig from '../utils/extend-browsersync-config.js';

export type Preset = {
  name: string;
  handler(config: MetaConfig, utils:{
    extendWebpack: typeof extendWebpackConfig,
    extendBrowsersync: typeof extendBrowsersyncConfig,
    isDev: boolean,
  }):Promise<void>;
}
