import { cwd } from 'node:process';
import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.prod.config.js';

/**
 * Bundle for production.
 * @param   {{ analyze?: boolean, mode?: 'development'|'production' }} [options]
 * @returns {Promise<void>}
 */
export default async (options = {}) => {
  const config = await getConfig({ ...options, mode: 'development' });
  const webpackConfig = await getWebpackConfig(config);
  webpackConfig.watch = true;
  webpackConfig.optimization.minimize = false;
  webpackConfig.mode = 'development';
  webpackConfig.devtool = 'eval-cheap-source-map';
  const statsConfig = {
    all: false,
    errors: true,
    warnings: true,
    assets: true,
    colors: true,
  };

  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
  );

  console.log(`Compiling assets to ${webpackConfig.output.path.replace(cwd(), '.')}...`);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    if (!stats.hasErrors()) {
      console.log(stats.toString(statsConfig));
    }
    console.log('');
  });
};
