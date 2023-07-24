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
        }),
      );
      console.log('');
      resolve(stats);
    });
  });
}

export default async (options = {}) => {
  const config = await getConfig(options);
  const webpackConfig = await getWebpackConfig(config);
  webpackConfig.watch = true;
  webpackConfig.optimization.minimize = false;
  webpackConfig.mode = 'development';
  webpackConfig.stats = {
    all: false,
    errors: true,
    warnings: true,
    assets: true,
    colors: true,
    excludeAssets: [/\.map$/, /^(assets-)?manifest\.(js|json)$/],
  };

  await build(webpackConfig, 'modern');
};
