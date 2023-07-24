import { cwd } from 'process';
import webpack from 'webpack';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.prod.config.js';

/**
 * Build a given Webpack config.
 * @param {WebpackConfig} config The Weback configuration object.
 * @param {string} name The name of the build.
 */
async function build(config, name) {
  console.log(`Building ${name} bundle in ${config.output.path.replace(cwd(), '.')}...`);

  return new Promise((resolve, reject) => {
    console.time('Built in');
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }

      console.log(
        stats.toString({
          ...config.stats,
          colors: true,
        })
      );
      console.log('');
      console.timeEnd('Built in');

      if (stats.hasErrors()) {
        reject(stats);
      } else {
        resolve(stats);
      }
    });
  });
}

export default async (options = {}) => {
  const config = await getConfig(options);
  const webpackConfig = await getWebpackConfig(config);
  await build(webpackConfig, 'modern');
};
