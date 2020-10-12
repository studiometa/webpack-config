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

```ts
// meta.config.js
module.exports = {
  src: [
    './path/to/src/js/*.js',
    './path/to/src/css/*.scss',
  ],
  dist: './path/to/dist',
  public: '/path/to/dist',

  /**
   * Analyze the bundle with the WebpackBundleAnalyzer plugin.
   * @type {Boolean}
   * @optional
   */
  analyze: false,

  /**
   * Extends the Webpack configuration before merging
   * with the environment specific configurations.
   * @type {Function}
   * @optional
   */
  webpack(config, isDev) {},

  /**
   * Extends the development Webpack configuration.
   * @param {WebpackConfig} devConfig The Webpack development config.
   * @type {Function}
   * @optional
   */
  webpackDev(devConfig) {},

  /**
   * Extends the production Webpack configuration.
   * @param {WebpackConfig} devConfig The Webpack production config.
   * @type {Function}
   * @optional
   */
  webpackProd(prodConfig) {},

  /**
   * Configure the `sass-loader` options.
   * @type {Objet}
   * @optional
   * @see https://github.com/webpack-contrib/sass-loader#sassoptions
   */
  sassOptions: {},

  /**
   * Configure the browserSync server if you do not use a proxy by setting
   * this property to `true` or a BrowserSync server configuration object.
   * If the property is a function, it will be used to alter the server
   * configuraton and instance in proxy mode.
   * @see https://browsersync.io/docs/options#option-server
   * @type {Boolean|Object|Function}
   * @optional
   */
  server: true,
  server(bsConfig, bs) {},

  /**
   * Watch for file changes in dev mode and:
   * - reload the browser
   * - or execute a callback
   * @see https://browsersync.io/docs/api#api-watch
   * @type {Array<String|Array>}
   * @optional
   */
  watch: [
    // Watch for changes on all PHP files and reload the browser
    '*.php',
    // Watch for all events on all HTML files and execute the callback
    [
      '*.html',
      (event, file, bs, bsConfig) => {
        if (event === 'change') {
          bs.reload();
        }
      },
    ],
  ],

  /**
   * Use presets to apply pre-made configurations.
   * @type {Array<String|Array<String,Object>>}
   * @optional
   */
  presets: [
    'twig', // use the `twig` preset
    ['twig', {}], // use the `twig` preset with custom options
    'tailwindcss', // use the `tailwindcss` preset,
    'prototyping', // use the `prototyping` preset
    'yaml', // use the `yaml` preset
  ],
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

```bash
node_modules/.bin/meta build
```

You can analyze your bundle(s) with the `--analyze` (or `-a`) argument:s

```bash
node_modules/.bin/meta build --analyze
```

## Presets

Presets can be used to extend the CLI configuration elegantly. The following presets are shipped with the package and can be used without installing any more dependencies:

- [`twig`](#twig)
- [`tailwindcss`](#tailwindcss)
- [`prototyping`](#prototyping)
- [`yaml`](#yaml)

Read their documentation below to find out how to use and configure them.

### `twig`

Add the `twig-html-loader` to the Webpack configuration.

#### Options

- `loaderOptions` (`Object`): [options](https://github.com/radiocity/twig-html-loader#options) for the Twig loader
- `pluginOptions` (`Object`): [options](https://github.com/jantimon/html-webpack-plugin#options) for the `HtmlWebpackPlugin` plugin

#### Examples

Use it without configuration:

```js
module.exports = {
  presets: ['twig'],
};
```

Or configure the loader and plugin options:

```js
module.exports = {
  presets: [
    [
      'twig',
      {
        loaderOptions: {},
        pluginOptions: { template: './src/templates/index.twig' },
      },
    ],
  ],
};
```

### `tailwindcss`

Add [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) to the [PostCSS](https://github.com/postcss/postcss) configuration.

#### Options

- `path` (`String`): the absolute path to the Tailwind CSS entry file

#### Examples

Use it without configuration:

```js
module.exports = {
  presets: ['tailwindcss'],
};
```

If the `meta` CLI fails to resolve the `tailwindcss` package, specify its path:

```js
const path = require('path');

module.exports = {
  presets: [
    [
      'tailwindcss',
      {
        path: path.resolver(__dirname, 'node_modules/tailwindcss/lib/index.js'),
      }
    ],
  ],
};
```

### `prototyping`

Add the [`twig`](#twig) and [`tailwindcss`](#tailwindcss) presets as well as default values for the project's structure.

#### Options

- `twig` (`Object`): options for the [`twig` preset](#twig)
- `tailwindcss` (`Object`): options for the [`tailwindcss` preset](#tailwindcss)

#### Examples

```js
module.exports = {
  presets: ['twig'],
};
```

### `yaml`

Add support for the import of YAML files with the [js-yaml-loader](https://github.com/wwilsman/js-yaml-loader).

#### Options

- `loaderOptions` (`Object`): [options](https://github.com/wwilsman/js-yaml-loader#loader-options) for the `js-yaml-loader`

#### Example

```js
module.exports = {
  presets: ['yaml'],
};
```

## Contributing

This project's branches are managed with [Git Flow](https://github.com/petervanderdoes/gitflow-avh), every feature branch must be merged into develop via a pull request.
