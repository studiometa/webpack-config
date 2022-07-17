import extendWebpackConfig from '../utils/extend-webpack-config.js';

export default async function vue3(config) {
  await extendWebpackConfig(config, async (webpackConfig) => {
    // Do vue3 stuff here
  });
}
