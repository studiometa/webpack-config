import webpackMerge from 'webpack-merge';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import WebpackBar from 'webpackbar';

export const defaultConfig = {
  mode: 'production',
  cache: true,
  devtool: 'source-map',
  target: 'web',
  output: {
    pathinfo: false,
    filename: '[name].js',
    chunkFilename: 'chunk/[name].js',
    sourceMapFilename: 'maps/[file].map',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceMap: true,
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              plugins: [require('autoprefixer')(), require('cssnano')()],
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
  stats: {
    all: false,
    assets: true,
    cached: true,
    colors: true,
    errorDetails: true,
    errors: true,
    maxModules: 0,
    modules: true,
    moduleTrace: true,
    performance: true,
    timings: true,
    warnings: true,
    excludeAssets: /\.map$/,
  },
  resolve: {
    extensions: ['.vue', '.mjs', '.js', '.json'],
  },
  plugins: [new WebpackBar(), new VueLoaderPlugin()],
  optimization: {
    checkWasmTypes: true,
    concatenateModules: true,
    flagIncludedChunks: true,
    minimize: true,
    minimizer: [
      compiler => {
        const MinifyPlugin = require('babel-minify-webpack-plugin');
        return new MinifyPlugin({}, { sourceMap: true }).apply(compiler);
      },
    ],
    namedChunks: false,
    namedModules: false,
    nodeEnv: 'production',
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
      automaticNameDelimiter: '~',
      name: true,
    },
  },
};

export const mergeConfig = (...webpackConfigs) =>
  webpackMerge(defaultConfig, ...webpackConfigs);

export { default as findEntries } from './utils/find-entries';

export default defaultConfig;
