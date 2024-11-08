import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { HotAcceptPlugin } from 'hot-accept-webpack-plugin';
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import getConfig from './utils/get-config.js';
import getWebpackConfig from './webpack.dev.config.js';
import getServer from './utils/get-browsersync.js';

/**
 * Init dev server.
 * @param   {{ analyze?: boolean }} [options]
 * @returns {Promise<void>}
 */
export default async function dev(options = {}) {
  const config = await getConfig({ ...options, mode: 'development' });
  const webpackConfig = await getWebpackConfig(config);
  const server = await getServer(config);

  const webpackBar = webpackConfig.plugins.find(
    (plugin) => plugin.constructor.name === 'WebpackBarProgressPlugin',
  );

  let webpackBarHasRunOnce = false;
  const [fancyReporter] = webpackBar.webpackbar.reporters;
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
    new HotAcceptPlugin({
      test: /^(?!.*\/node_modules\/).*\.(js|ts|mjs|cjs)$/,
    }),
  ];

  webpackConfig.entry = Object.fromEntries(
    Object.entries(webpackConfig.entry).map(([name, value]) => [
      name,
      ['webpack-hot-middleware/client?reload=true', ...(Array.isArray(value) ? value : [value])],
    ]),
  );

  const bundler = webpack(webpackConfig);

  bundler.hooks.afterDone.tap('@studiometa/webpack-config', (stats) => {
    if (stats.hasErrors()) {
      console.log(...stats.compilation.errors);
      return;
    }
    console.log(
      stats.toString({
        all: false,
        assets: true,
        colors: true,
        excludeAssets: [/\.map$/, /hot-update/, /^manifest\.(js|json)$/],
      }),
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
}
