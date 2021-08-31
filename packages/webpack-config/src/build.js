import webpack from 'webpack';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.prod.config.js';

export default async (options = {}) => {
  process.env.NODE_ENV = 'production';

  const config = await getConfig(options);
  const webpackConfig = getWebpackConfig(config);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(
      stats.toString({
        ...webpackConfig.stats,
        colors: true,
      })
    );
  });
};
