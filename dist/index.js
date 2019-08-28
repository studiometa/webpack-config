"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "findEntries", {
  enumerable: true,
  get: function get() {
    return _findEntries["default"];
  }
});
exports["default"] = exports.mergeConfig = exports.defaultConfig = void 0;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _plugin = _interopRequireDefault(require("vue-loader/lib/plugin"));

var _findEntries = _interopRequireDefault(require("./utils/find-entries"));

var defaultConfig = {
  mode: 'production',
  cache: true,
  devtool: 'source-map',
  target: 'web',
  output: {
    pathinfo: false,
    filename: '[name].js',
    chunkFilename: 'chunk/[name].js',
    sourceMapFilename: 'maps/[file].map'
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      type: 'javascript/auto',
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader',
        options: {
          sourceMap: true,
          cacheDirectory: true
        }
      }]
    }, {
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.s?css$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          sourceMap: false
        }
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: false,
          plugins: [require('autoprefixer')(), require('cssnano')()]
        }
      }, {
        loader: 'resolve-url-loader',
        options: {
          sourceMap: false
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: false,
          implementation: require('sass')
        }
      }]
    }]
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
    excludeAssets: /\.map$/
  },
  resolve: {
    extensions: ['.vue', '.mjs', '.js', '.json']
  },
  plugins: [new _plugin["default"]()],
  optimization: {
    checkWasmTypes: true,
    concatenateModules: true,
    flagIncludedChunks: true,
    minimize: true,
    minimizer: [function (compiler) {
      var MinifyPlugin = require('babel-minify-webpack-plugin');

      return new MinifyPlugin({}, {
        sourceMap: true
      }).apply(compiler);
    }],
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
      name: true
    }
  }
};
exports.defaultConfig = defaultConfig;

var mergeConfig = function mergeConfig(webpackConfig) {
  return (0, _webpackMerge["default"])(defaultConfig, webpackConfig);
};

exports.mergeConfig = mergeConfig;
var _default = defaultConfig;
exports["default"] = _default;