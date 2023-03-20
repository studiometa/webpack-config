import { cwd } from 'process';
import rspack from '@rspack/core';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
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
    const compiler = rspack.createCompiler(config);

    compiler.watch(
      {
        ignored: /node_modules/,
      },
      (err, stats) => {
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
      }
    );
  });
}

export default async (options = {}) => {
  process.env.NODE_ENV = 'watch';
  process.env.BABEL_ENV = 'modern';

  const config = await getConfig(options);
  const webpackConfig = await getWebpackConfig(config, { isModern: true });
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

  const webpackBar = webpackConfig.plugins.find(
    (plugin) => plugin.constructor.name === 'WebpackBarPlugin'
  );

  let webpackBarHasRunOnce = false;
  const [fancyReporter] = webpackBar.reporters;
  webpackBar.reporters = [
    {
      progress: (...args) => {
        if (webpackBarHasRunOnce) {
          return;
        }
        fancyReporter.progress(...args);
      },
      done: () => {
        webpackBarHasRunOnce = true;
      },
    },
  ];

  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
    })
  );

  await build(webpackConfig, 'modern');
};
