# Webpack Configuration

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config)
[![Dependency Status](https://img.shields.io/david/studiometa/webpack-config.svg?label=deps&style=flat-square)](https://david-dm.org/studiometa/webpack-config)
[![devDependency Status](https://img.shields.io/david/dev/studiometa/webpack-config.svg?label=devDeps&style=flat-square)](https://david-dm.org/studiometa/webpack-config?type=dev)

> Run a development server and build your assets with Webpack.

## Installation

Install the package in your project:

```bash
npm install --save-dev @studiometa/webpack-config
```

## Usage

Create a `meta.config.js` file at the root of yout project:

```js
// meta.config.js
module.exports = {
  src: [
    './path/to/src/js/*.js',
    './path/to/src/css/*.scss',
  ],
  dist: './path/to/dist',
  public: '/path/to/dist',
  webpack(config, isDev) {
    // Extends the webpack config here.
  },
  sassOptions: {
    // Configure the Sass implementation.
    // @see https://github.com/webpack-contrib/sass-loader#sassoptions
  },
};
```

Configure a `.env` file with the following values:

```bash
APP_HOST=local.fqdn.com
APP_SSL=true|false

# If APP_SSL is true, add the following:
APP_SSL_CERT=/absolute/path/to/ssl/cert
APP_SSL_KEY=/absolute/path/to/ssl/key
```

You can then start the development server:

```bash
node_modules/.bin/meta dev
```

And build your assets:

```
node_modules/.bin/meta build
```

## Contributing

This project's branches are managed with [Git Flow](https://github.com/petervanderdoes/gitflow-avh), every feature branch must be merged into develop via a pull request.
