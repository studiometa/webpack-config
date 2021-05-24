import webpack from 'webpack';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.prod.config.js';

/**
 * Build a given Webpack config.
 * @param {WebpackConfig} config The Weback configuration object.
 * @param {String} name The name of the build.
 */
async function build(config, name) {
  console.log(`Building ${name}...`);

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
        })
      );
      console.log('');
      resolve(stats);
    });
  });
}

export default async (options = {}) => {
  process.env.NODE_ENV = 'production';
  const config = await getConfig(options);

  if (config.modern) {
    process.env.BABEL_ENV = 'modern';
    const modern = await getWebpackConfig(config);
    await build(modern, 'modern');
  }

  if (config.legacy) {
    process.env.BABEL_ENV = 'legacy';
    const legacy = await getWebpackConfig(config);
    await build(legacy, 'legacy');
  }
};
