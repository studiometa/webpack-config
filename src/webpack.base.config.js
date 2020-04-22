const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBar = require('webpackbar');
const entry = require('webpack-glob-entry');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const commonDir = require('common-dir');
const findUp = require('find-up');

require('dotenv').config();

const configPath = findUp.sync('meta.config.js');

if (!configPath) {
  throw new Error(
    ['Could not find a config file.', 'Is there a meta.config.js file up in the folder tree?'].join(
      '\n'
    )
  );
}

// eslint-disable-next-line import/no-dynamic-require
const config = require(configPath);

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
    path: path.resolve(path.dirname(configPath), config.dist),
    publicPath: config.public,
    pathinfo: false,
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    sourceMapFilename: '[file].map',
  },
  stats: {
    all: false,
    assets: true,
    colors: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    maxModules: 0,
    modules: true,
    excludeAssets: /hot-update/,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          // 'cache-loader',
          'babel-loader',
          'webpack-module-hot-accept',
        ],
      },
      {
        test: /\.vue$/,
        use: [
          // 'cache-loader',
          'vue-loader',
          'webpack-module-hot-accept',
        ],
      },
      {
        test: /\.vue\.(sa|sc|c)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
      },
      {
        test: /(?<!\.vue)\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader',
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
      path.join(path.dirname(configPath), 'node_modules'),
    ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.join(__dirname, '..', 'node_modules'),
      path.join(path.dirname(configPath), 'node_modules'),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new StylelintPlugin({
      context: src,
      files: ['**/*.s?(a|c)ss', '**/*.vue'],
      fix: true,
      emitError: true,
      emitWarning: true,
    }),
    new FixStyleOnlyEntriesPlugin({
      silent: true,
    }),
    new VueLoaderPlugin(),
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'chunks/[id].css',
    }),
  ],
  optimization: {
    checkWasmTypes: true,
    concatenateModules: true,
    flagIncludedChunks: true,
    minimize: true,
    namedChunks: true,
    namedModules: true,
    noEmitOnErrors: true,
    occurrenceOrder: true,
    sideEffects: true,
    usedExports: true,
    splitChunks: {
      hidePathInfo: true,
      chunks: 'async',
      minSize: 100000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '--',
      name: true,
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
  config.webpack(webpackBaseConfig);
}

module.exports = webpackBaseConfig;
