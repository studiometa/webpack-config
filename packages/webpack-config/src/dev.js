import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.dev.config.js';
import getServer from './utils/get-browsersync.js';

export default async (options = {}) => {
  process.env.NODE_ENV = 'development';

  const config = await getConfig(options);
  const webpackConfig = await getWebpackConfig(config);
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
          return [server.getInfo()];
        },
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ];

  webpackConfig.entry = Object.fromEntries(
    Object.entries(webpackConfig.entry).map(([name, value]) => [
      name,
      ['webpack-hot-middleware/client?reload=true', ...(Array.isArray(value) ? value : [value])],
    ])
  );

  const bundler = webpack(webpackConfig);

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
    console.log('');
  });

  const browserSyncConfig = {
    ...server.config,
    middleware: [
      ...(server.config.middleware || []),
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
      }),
      webpackHotMiddleware(bundler, { log: false }),
    ],
  };

  server.instance.init(browserSyncConfig);
};
