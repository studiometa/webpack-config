import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import FriendlyErrorsWebpackPlugin from '@nuxtjs/friendly-errors-webpack-plugin';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.dev.config.js';
import getServer from './utils/get-browsersync.js';

export default async (options = {}) => {
  process.env.NODE_ENV = 'development';

  const config = await getConfig(options);
  const webpackConfig = getWebpackConfig(config);
  const server = getServer(config);

  const webpackBar = webpackConfig.plugins.find(
    (plugin) => plugin.constructor.name === 'WebpackBarPlugin'
  );

  webpackBar.reporters.push({
    start: ({ state }) => server.instance.notify(state.message),
    change: ({ state }) => server.instance.notify(state.message),
    update: ({ state }) => server.instance.notify(state.message),
    done: ({ state }) => server.instance.notify(state.message),
    progress: ({ state }) => server.instance.notify(`${state.message} ${state.progress}%`),
    allDone: ({ state }) => server.instance.notify(state.message),
    beforeAllDone: ({ state }) => server.instance.notify(state.message),
    afterAllDone: ({ state }) => server.instance.notify(state.message),
  });

  // Use the same error display as Nuxt
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        get messages() {
          return [server.getInfo()];
        },
      },
    })
  );

  // Enable HMR
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // Add the dev server and hot middleware dependencies to the JS entries
  webpackConfig.entry = Object.entries(webpackConfig.entry).reduce((entry, [name, value]) => {
    if (value.endsWith('.js')) {
      entry[name] = [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        ...(Array.isArray(value) ? value : [value]),
      ];
    } else {
      entry[name] = value;
    }

    return entry;
  }, {});

  const bundler = webpack(webpackConfig);
  bundler.hooks.done.tap('BrowserSync', (stats) => {
    const { assets, outputPath } = stats.toJson();
    console.log(
      stats.toString({ ...webpackConfig.stats, warnings: false, errors: false, colors: true })
    );
    console.log('');

    // Inject only CSS files as other files are handled by the Webpack dev server
    const files = assets
      .filter(({ emitted, name }) => emitted && name.endsWith('.css'))
      .map(({ name }) => {
        return path.join(outputPath, name);
      });

    return server.instance.reload(files);
  });

  const browserSyncConfig = {
    ...server.config,
    middleware: [
      ...(server.config.middleware || []),
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: webpackConfig.stats,
        logLevel: 'silent',
        writeToDisk(filePath) {
          return !filePath.includes('hot-update');
        },
      }),
      webpackHotMiddleware(bundler, { log: false }),
    ],
  };

  server.instance.init(browserSyncConfig);
};
