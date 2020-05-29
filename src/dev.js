const path = require('path');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const FriendlyErrorsWebpackPlugin = require('@nuxtjs/friendly-errors-webpack-plugin');

module.exports = (options = {}) => {
  process.env.NODE_ENV = 'development';

  const config = require('./utils/get-config')(options);
  const webpackConfig = require('./webpack.dev.config')(config);

  // Configure browserSync
  const browserSyncOptions = {
    open: false,
    logPrefix: '',
    logFileChanges: false,
    logLevel: 'silent',
    notify: {
      styles: [
        'z-index: 99999998',
        'position: fixed',
        'right: 1em',
        'bottom: 1em',
        'display: none',
        'padding: 0.6em 0.8em 0.7em',
        'margin: 0',
        'font-family: JetBrains Mono, Fira Code, monospace',
        'font-size: 12px',
        'font-weight: 400',
        'text-align: center',
        'color: white',
        'background-color: #1B2032',
        'border-radius: 5px',
        'text-transform: capitalize',
      ],
    },
  };

  if (config.server) {
    browserSyncOptions.server = config.server;
  } else {
    const APP_HOST = process.env.APP_HOST || process.env.APP_HOSTNAME;
    browserSyncOptions.proxy = APP_HOST;
  }

  if (config.watch) {
    config.watch.forEach((glob) => {
      browserSync.watch(glob).on('change', browserSync.reload);
    });
  }

  // Enable `https://` with browserSync
  if (
    process.env.APP_SSL &&
    process.env.APP_SSL === 'true' &&
    process.env.APP_SSL_CERT &&
    process.env.APP_SSL_KEY
  ) {
    if (browserSyncOptions.proxy) {
      browserSyncOptions.proxy = `https://${browserSyncOptions.proxy}`;
    }
    browserSyncOptions.https = {
      cert: path.resolve(process.env.APP_SSL_CERT),
      key: path.resolve(process.env.APP_SSL_KEY),
    };
  }

  const getServerInfo = () => {
    if (!browserSync.active) {
      return 'Application not running.';
    }

    const port = browserSync.getOption('port');
    const proxy = browserSync.getOption('proxy');
    const protocol = browserSyncOptions.https ? 'https://' : 'http://';
    const target = proxy ? proxy.get('target') : `${protocol}localhost`;

    return `Application running at \x1b[34m${target}:${port}\x1b[0m\n`;
  };

  const webpackBar = webpackConfig.plugins.find(
    (plugin) => plugin.constructor.name === 'WebpackBarPlugin'
  );

  webpackBar.reporters.push({
    start: ({ state }) => browserSync.notify(state.message),
    change: ({ state }) => browserSync.notify(state.message),
    update: ({ state }) => browserSync.notify(state.message),
    done: ({ state }) => browserSync.notify(state.message),
    progress: ({ state }) => browserSync.notify(`${state.message} ${state.progress}%`),
    allDone: ({ state }) => browserSync.notify(state.message),
    beforeAllDone: ({ state }) => browserSync.notify(state.message),
    afterAllDone: ({ state }) => browserSync.notify(state.message),
  });

  // Use the same error display as Nuxt
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        get messages() {
          return [getServerInfo()];
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

    return browserSync.reload(files);
  });

  browserSyncOptions.middleware = [
    webpackDevMiddleware(bundler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats,
      logLevel: 'silent',
      writeToDisk(filePath) {
        return !filePath.includes('hot-update');
      },
    }),
    webpackHotMiddleware(bundler, { log: false }),
  ];

  browserSync.init(browserSyncOptions);
};
