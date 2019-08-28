# Webpack Configuration

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config)
[![NPM Beta Version](https://img.shields.io/npm/v/@studiometa/webpack-config/beta.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config/v/beta)
[![Dependency Status](https://img.shields.io/david/studiometa/webpack-config.svg?label=deps&style=flat-square)](https://david-dm.org/studiometa/webpack-config)
[![devDependency Status](https://img.shields.io/david/dev/studiometa/webpack-config.svg?label=devDeps&style=flat-square)](https://david-dm.org/studiometa/webpack-config?type=dev)

> Simplify your Webpack configuration by merging it with the default configuration defined in this package.

## Installation

Install the package with your favorite package manager:

```bash
# With NPM
npm install --save-dev @studiometa/webpack-config

# Or Yarn
yarn add --dev @studiometa/webpack-config
```

## Usage

In your `webpack.config.js` file, use the default export to merge you configuration with some sane defaults:

```js
// webpack.config.js
const { webpackMerge } = require('@studiometa/webpack-config');

module.exports = webpackMerge({
  entry: './src/app.js',
  output: {
    path: '/path/to/dist',
  },
});
```

### Multiple entries

If you need to have multiple entries for your project, you can use the `findEntries(glob, cwd, options)` method to find all files to be added as entries.

```js
// webpack.config.js
const { webpackMerge, findEntries } = require('@studiometa/webpack-config');

module.exports = webpackMerge({
  entry: findEntries('**/*.js', '/path/to/src'),
  output: {
    path: '/path/to/dist',
  },
});
```

### Exclude some files

The `glob` parameter of the `findEntries` function can be an `Array` of globs and will exclude the files matching a glob starting with a `!`. If you want to exclude all files from a `vendors/` folder, you can do the following:

```js
// webpack.config.js
const { webpackMerge, findEntries } = require('@studiometa/webpack-config');

module.exports = webpackMerge({
  entry: findEntries(['**/*.js', '!vendors/*'], '/path/to/src'),
  output: {
    path: '/path/to/dist',
  },
});
```

## Documentation

The methods and object described below are exported by the package, the `defaultConfig` object is also exported as the default export.

### `webpackMerge(webpackConfig)` _(Function)_

### Description
This function will merge (with the [`webpack-merge` package](https://github.com/survivejs/webpack-merge)) the given `config` with the default config provided by the package. The `entry` and `output.path` properties are required in the given `config` parameter.

### Usage
```js
// webpack.config.js
const { webpackMerge } = require('@studiometa/webpack-config');

module.exports = webpackMerge({
  entry: 'src/app.js',
  output: {
    path: '/path/to/dist',
  },
});
```

### `findEntries(glob, cwd, options = {})` _(Function)_

#### Description
This function will generate an object to be used as the `entry` property of the Webpack configuration. It will find all files matching the given `glob` in the given `cwd` path. The `options` parameter is passed to the [`glob.sync(pattern, [options])` function](https://github.com/isaacs/node-glob#globsyncpattern-options).

### Usage
```js
// webpack.config.js
const { webpackMerge, findEntries } = require('@studiometa/webpack-config');
// Find all .js files excluding the one starting with a `_`.
// Given the following folder structure:
// path/to/src/
//   app.js
//   utils/
//     debug.js
//     _error.js
const entries = findEntries(['**/*.js', '!**/_*.js'], 'path/to/src');
// We will have the following object:
// {
//   app: 'path/to/src/app.js',
//   'utils/debug': 'path/to/src/utils/debug.js'
// }

module.exports = webpackMerge({
  entry: entries,
  output: {
    path: '/path/to/dist',
  },
});
```

### `defaultConfig` _(Object)_

### Description
The default Webpack configuration used by this package.

```js
const defaultConfig = {
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
  plugins: [new VueLoaderPlugin()],
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
```

## Contributing

This project's branches are managed with [Git Flow](https://github.com/petervanderdoes/gitflow-avh), every feature branch must be merged into develop via a pull request.
