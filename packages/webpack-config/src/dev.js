const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const getMetaConfig = require('./utils/get-config');
const getWebpackConfig = require('./webpack.dev.config');
const getServer = require('./utils/get-browsersync');

module.exports = (options = {}) => {
  process.env.NODE_ENV = 'development';

  const config = getMetaConfig(options);
  const webpackConfig = getWebpackConfig(config);
  const server = getServer(config);

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
    {
      start: ({ state }) => server.instance.notify(state.message),
      change: ({ state }) => server.instance.notify(state.message),
      update: ({ state }) => server.instance.notify(state.message),
      done: ({ state }) => server.instance.notify(state.message),
      progress: ({ state }) => server.instance.notify(`${state.message} ${state.progress}%`),
      allDone: ({ state }) => server.instance.notify(state.message),
      beforeAllDone: ({ state }) => server.instance.notify(state.message),
      afterAllDone: ({ state }) => server.instance.notify(state.message),
    },
  ];

  // Use the same error display as Nuxt
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
      compilationSuccessInfo: {
        get messages() {
          return server.getInfo();
        },
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ];

  // Add the dev server and hot middleware dependencies to the JS entries
  webpackConfig.entry = Object.entries(webpackConfig.entry).reduce((entry, [name, value]) => {
    if (value.endsWith('.js')) {
      entry[name] = [
        'webpack-hot-middleware/client?reload=true',
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

    // Inject only CSS files as other files are handled by the Webpack dev server
    const files = assets
      .filter(({ emitted, name }) => emitted && name.endsWith('.css'))
      .map(({ name }) => {
        return path.join(outputPath, name);
      });

    return server.instance.reload(files);
  });

  bundler.hooks.afterDone.tap('@studiometa/webpack-config', (stats) => {
    if (stats.hasErrors()) {
      return;
    }
    console.log(
      stats.toString({
        all: false,
        assets: true,
        colors: true,
        excludeAssets: [/\.map$/, /hot-update/, /^manifest\.(js|json)$/],
      })
    );
    console.log('');
  });

  const browserSyncConfig = {
    ...server.config,
    middleware: [
      ...(server.config.middleware || []),
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        writeToDisk(filePath) {
          return !filePath.includes('hot-update');
        },
      }),
      webpackHotMiddleware(bundler, { log: false }),
    ],
  };

  server.instance.init(browserSyncConfig);
};
