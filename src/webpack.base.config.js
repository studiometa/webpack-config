const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBar = require('webpackbar');
const entry = require('webpack-glob-entry');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const commonDir = require('common-dir');

// Fix a bug where the webpack bar is stuck at 99%.
// eslint-disable-next-line no-underscore-dangle
const { updateProgress } = WebpackBar.prototype;
WebpackBar.prototype.updateProgress = function updateProgressOverride(percent = 0, ...args) {
  updateProgress.call(this, percent >= 0.99 ? 1 : percent, ...args);
};

require('dotenv').config();

module.exports = (config) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const src = commonDir(config.src);

  const webpackBaseConfig = {
    entry: entry((filePath) => {
      const extname = path.extname(filePath);
      return filePath.replace(src, '').replace(extname, '');
    }, ...config.src),
    devtool: 'source-map',
    target: 'web',
    output: {
      path: path.resolve(path.dirname(config.PATH), config.dist),
      publicPath: config.public,
      pathinfo: false,
      filename: '[name].js',
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      sourceMapFilename: '[file].map',
      clean: true,
    },
    cache: {
      type: 'filesystem',
      name: isDev ? 'dev' : 'prod',
    },
    stats: {
      all: false,
      assets: true,
      colors: true,
      warnings: true,
      errors: true,
      errorDetails: true,
      performance: true,
      excludeAssets: isDev
        ? [/\.map$/, /hot-update/, /^manifest\.(js|json)$/]
        : [/\.map$/],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          type: 'javascript/auto',
          get use() {
            const babel = {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            };

            return isDev ? ['webpack-module-hot-accept', babel] : [babel];
          },
        },
        {
          test: /\.vue$/,
          use: isDev ? ['vue-loader', 'webpack-module-hot-accept'] : ['vue-loader'],
        },
        {
          test: /\.vue\.(sa|sc|c)ss$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { url: (url) => !url.startsWith('/') } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: isDev ? ['autoprefixer'] : ['autoprefixer', 'cssnano'],
                },
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: config.sassOptions || {},
              },
            },
          ],
        },
        {
          test: /(?<!\.vue)\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: 'css-loader', options: { url: (url) => !url.startsWith('/') } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: isDev ? ['autoprefixer'] : ['autoprefixer', 'cssnano'],
                },
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: config.sassOptions || {},
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                esModule: false,
                limit: 1000,
                name: 'img/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                esModule: false,
                limit: 10,
                name: 'svg/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                name: 'fonts/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(webm|mp4|ogv)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 1000,
                name: 'videos/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.vue', '.mjs', '.js', '.json'],
      modules: [
        'node_modules',
        path.join(__dirname, '..', 'node_modules'),
        path.join(path.dirname(config.PATH), 'node_modules'),
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(__dirname, '..', 'node_modules'),
        path.join(path.dirname(config.PATH), 'node_modules'),
      ],
    },
    plugins: [
      new ESLintPlugin({
        context: src,
        extensions: ['js', 'vue'],
        fix: true,
        failOnError: !isDev,
      }),
      new StylelintPlugin({
        context: src,
        files: ['**/*.s?(a|c)ss', '**/*.vue'],
        fix: true,
        allowEmptyInput: true,
        failOnError: !isDev,
      }),
      new VueLoaderPlugin(),
      new WebpackBar(),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: isDev ? '[name].css' : '[name].[contenthash].css',
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: true,
        }),
      ],
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
          },
        },
      },
    },
  };

  if (config.analyze) {
    webpackBaseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: isDev ? 'server' : 'static',
        excludeAssets: /hot-update/,
      })
    );
  }

  if (config.webpack && typeof config.webpack === 'function') {
    config.webpack(webpackBaseConfig, isDev);
  }
  return webpackBaseConfig;
};
