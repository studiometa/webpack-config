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
    'tailwindcss', // use the `tailwindcss` preset
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

## Contributing

This project's branches are managed with [Git Flow](https://github.com/petervanderdoes/gitflow-avh), every feature branch must be merged into develop via a pull request.
