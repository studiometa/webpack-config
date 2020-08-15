const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const FriendlyErrorsWebpackPlugin = require('@nuxtjs/friendly-errors-webpack-plugin');

module.exports = (options = {}) => {
  process.env.NODE_ENV = 'development';

  const config = require('./utils/get-config')(options);
  const webpackConfig = require('./webpack.dev.config')(config);
  const server = require('./utils/get-browsersync')(config);

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
    console.log(stats.toString({ ...webpackConfig.stats, colors: true }));
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
