import { cwd } from 'node:process';
import webpack from 'webpack';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.prod.config.js';

/**
 * Bundle for production.
 * @param   {{ analyze?: boolean, mode?: 'development'|'production' }} [options]
 * @returns {Promise<void>}
 */
export default async (options = {}) => {
  const start = performance.now();
  const config = await getConfig(options);
  const webpackConfig = await getWebpackConfig(config);
  console.log(`Compiling assets to ${webpackConfig.output.path.replace(cwd(), '.')}...`);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }

    console.log(
      stats.toString({
        ...webpackConfig.stats,
        colors: true,
      }),
    );
    console.log('');

    let duration = performance.now() - start;
    let unit = 'ms';

    if (duration >= 1000) {
      duration /= 1000;
      unit = 's';
    }
    console.log(`Compiled in ${duration.toFixed(2)}${unit}`);

    if (stats.hasErrors()) {
      process.exit(1);
    }
  });
};
