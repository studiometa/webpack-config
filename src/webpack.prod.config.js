const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

process.env.NODE_ENV = 'production';

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  cache: false,
  optimization: {
    checkWasmTypes: true,
    concatenateModules: true,
    flagIncludedChunks: true,
    minimize: true,
    namedChunks: true,
    namedModules: true,
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
});
