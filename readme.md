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
const webpackConfig = require('@studiometa/webpack-config');

module.exports = webpackConfig({
  entry: './src/app.js',
  output: {
    dist: './dist',
  },
});
```

### Multiple entries

If you need to have multiple entries for your project, you can use the `webpackConfig.findEntries(srcPath, glob)` method to find all files to be added as entries. It will find all files matching the `srcPath` and `glob` parameters and exclude all the ones beginning with a `_` (it is the same behavior as with Sass compilation).

```js
// webpack.config.js
const webpackConfig = require('@studiometa/webpack-config');

module.exports = webpackConfig({
  entry: webpackConfig.findEntries('./path/to/src', '**/*.js'),
  output: {
    dist: './dist',
  },
});
```

## Contributing

This project's branches are managed with [Git Flow](https://github.com/petervanderdoes/gitflow-avh), every feature branch must be merged into develop via a pull request.
