const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('lodash.merge');

module.exports = (config, options = {}) => {
  const opts = merge(
    {
      loaderOptions: { data: {} },
      pluginOptions: { template: './src/templates/index.twig' },
    },
    options
  );

  const oldWebpackConfig = typeof config.webpack === 'function' ? config.webpack : () => {};
  config.webpack = (webpackConfig, isDev) => {
    oldWebpackConfig(webpackConfig, isDev);
    webpackConfig.module.rules.push({
      test: /\.twig$/,
      use: [
        'raw-loader',
        {
          loader: 'twig-html-loader',
          options: opts.loaderOptions,
        },
      ],
    });
    webpackConfig.plugins.push(new HtmlWebpackPlugin(opts.pluginOptions));
  };
};
