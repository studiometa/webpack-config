import { cwd } from 'process';
import webpack from 'webpack';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.prod.config.js';

/**
 * Bundle for production.
 * @param   {{ analyze?: boolean, mode?: 'development'|'production' }} [options]
 * @returns {Promise<void>}
 */
export default async (options = {}) => {
  const config = await getConfig(options);
  const webpackConfig = await getWebpackConfig(config);
  console.log(`Building bundle in ${webpackConfig.output.path.replace(cwd(), '.')}...`);

  console.time('Built in');
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.message);
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
    console.timeEnd('Built in');

    if (stats.hasErrors()) {
      process.exit(1);
    }
  });
};
