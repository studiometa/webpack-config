# Webpack Configuration

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config)

> Run a development server and build your assets with Webpack.

## Installation

Install the package in your project:

```bash
npm install --save-dev @studiometa/webpack-config
```

## Usage

Create a `meta.config.js` file at the root of yout project:

````ts
// meta.config.mjs
import { defineConfig } from '@studiometa/webpack-config';
import { twig, yaml, tailwindcss, prototyping, eslint, stylelint, withContentHash } from '@studiometa/webpack-config/presets';
import vue from '@studiometa/webpack-config-preset-vue-3';

export default defineConfig({
  src: [
    './path/to/src/js/*.js',
    './path/to/src/css/*.scss',
  ],
  dist: './path/to/dist',
  public: '/path/to/dist',

  /**
   * Define which target to use when creating the bundle.
   * An array of targets will create a bundle for each target.
   * Defaults to `legacy`.
   *
   * @type {'modern'|'legacy'|Array<'modern'|'legacy'>}
   * @optional
   */
  target: ['modern', 'legacy'],

  /**
   * Analyze the bundle with the WebpackBundleAnalyzer plugin.
   * @type {Boolean}
   * @optional
   */
  analyze: false,

  /**
   * Merge all initial CSS chunks into one file.
   * Use a RegExp or a function to exclude some files:
   * ```js
   * mergeCSS: /^(?!.*css\/do-not-merge\.scss).*$/,
   * mergeCSS(module, chunk) {
   *   return module.constructor.name === 'CssModule';
   * },
   * ```
   * @type {Boolean|RegExp|Function}
   * @optional
   */
  mergeCSS: false,

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
    eslint(), // use the `eslint` preset
    stylelint(), // use the `stylelint` preset
    twig(), // use the `twig` preset
    tailwindcss(), // use the `tailwindcss` preset,
    prototyping(), // use the `prototyping` preset
    yaml(), // use the `yaml` preset,
    vue(), // use the Vue 3 preset,
    withContentHash(), // use the content hash preset
    {
      name: 'my-custom-preset',
      handler(metaConfig, { extendWebpack, extendBrowsersync, isDev }) {
        // ...
      },
    },
  ],
};
````

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

Or watch for changes to build you assets:

```bash
node_modules/.bin/meta watch
```

And build your assets for production:

```bash
node_modules/.bin/meta build
```

You can analyze your bundle(s) with the `--analyze` (or `-a`) argument:s

```bash
node_modules/.bin/meta build --analyze
```

## Features

- Raw imports with the `?raw` query
- SVG to Vue component with the `?as-vue-component` (requires a [vue preset](#vue))

## Presets

Presets can be used to extend the CLI configuration elegantly. The following presets are shipped with the package and can be used without installing any more dependencies:

- [`eslint`](#eslint)
- [`stylelint`](#stylelint)
- [`twig`](#twig)
- [`tailwindcss`](#tailwindcss)
- [`prototyping`](#prototyping)
- [`yaml`](#yaml)
- [`vue`](#vue)
- [`withContentHash`](#withContentHash)

Read their documentation below to find out how to use and configure them.

Custom presets can be used by using the path of a JS file (relative to the `meta.config.js` file):

```js
// meta.config.mjs
import { defineConfig } from '@studiometa/webpack-config';
import myPreset from './my-preset.mjs';

export default defineConfig({
  presets: [
    myPreset({ option: true })
  ],
})

// my-preset.mjs
export default function myPreset(options) {
  return {
    name: 'my-preset',
    async handler(metaConfig, { extendWebpack, isDev }) {
      metaConfig.public = 'auto';
      await extendWebpack(metaConfig, async (webpackConfig) => {
        webpackConfig.optimization.minimize = false;
      });
    }
  }
}
```

### `eslint`

Add ESLint validation with [`eslint-webpack-plugin`](https://github.com/webpack-contrib/eslint-webpack-plugin).

#### Options

The options object is directly passed to the `ESLintPlugin` constructor, see [the package documentation](https://github.com/webpack-contrib/eslint-webpack-plugin#options) for details.

#### Examples

Use it without configuration:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { eslint } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [eslint()],
});
```

Or pass custom options:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { eslint } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [eslint({
    fix: false,
  })],
});
```

### `stylelint`

Add StyleLint validation with [`stylelint-webpack-plugin`](https://github.com/webpack-contrib/stylelint-webpack-plugin).

#### Options

The options object is directly passed to the `StylelintPlugin` constructor, see [the package documentation](https://github.com/webpack-contrib/stylelint-webpack-plugin#options) for details.

#### Examples

Use it without configuration:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { stylelint } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [stylelint()],
});
```

Or pass custom options:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { stylelint } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [stylelint({
    fix: false,
  })],
});
```

### `twig`

Add the `twig-html-loader` to the Webpack configuration.

#### Options

The options object is directly passed to the [`twig-html-loader`](https://github.com/radiocity/twig-html-loader#options).

#### Examples

Use it without configuration:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { twig } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [twig()],
});
```

Or configure the loader options:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { twig } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [
    twig({
      debug: true,
    }),
  ],
});
```

### `tailwindcss`

Add [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) to the [PostCSS](https://github.com/postcss/postcss) configuration and enable a preview of your Tailwind configuration in dev mode with [`tailwind-config-viewer`](https://github.com/rogden/tailwind-config-viewer).

#### Options

- `path` (`String`): the absolute path to the Tailwind CSS entry file

#### Examples

Use it without configuration:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { tailwindcss } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [tailwindcss()],
});
```

If the `meta` CLI fails to resolve the `tailwindcss` package, specify its path:

```js
import path from 'node:path';
import { defineConfig } from '@studiometa/webpack-config';
import { twig } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [
    tailwindcss({
      path: path.resolve('./node_modules/tailwindcss/lib/index.js'),
    }),
  ],
});
```

The default route for the Tailwind config viewer is `/_tailwind/`. It is customisable with the `configViewerPath` options:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { twig } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [
    tailwindcss({
      configViewerPath: '/__custom_tailwind_viewer_path',
    }),
  ],
});
```

### `prototyping`

Add the [`twig`](#twig) and [`tailwindcss`](#tailwindcss) presets as well as default values for the project's structure.

#### Options

- `ts` (`boolean`): use `app.ts` as entry point instead of `app.js`
- `twig` (`Object`): options for the [`twig` preset](#twig)
- `tailwindcss` (`Object`): options for the [`tailwindcss` preset](#tailwindcss)
- `html` (`Object`): options for the [`html-webpack-plugin` plugin](https://github.com/jantimon/html-webpack-plugin#options)

#### Examples

Use it in your `meta.config.js` file:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { prototyping } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [prototyping()],
});
```

And set up your project with the following folder structure:

```
meta.config.js
package.json
public/ --> public assets, served from `/`
...
src/
  css/ --> css files
    app.scss
  js/ --> js files
    app.js
  templates/
    components/ --> component files, aliased to `@components`
    layouts/ --> layout files, aliased to `@layout`
    foo/ --> random files, aliased to `@foo`
    pages/
      index.twig
```

### `yaml`

Add support for the import of YAML files with the [js-yaml-loader](https://github.com/wwilsman/js-yaml-loader).

#### Options

- `loaderOptions` (`Object`): [options](https://github.com/wwilsman/js-yaml-loader#loader-options) for the `js-yaml-loader`

#### Example

```js
import { defineConfig } from '@studiometa/webpack-config';
import { yaml } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [yaml()],
});
```

### `vue`

Add support for Vue 2 or 3. The presets for Vue are available in two different packages, as their dependencies can not be installed in a single one. You will have to install the package corresponding to the version you want to use in your project:

```sh
# For Vue 2
npm install --save-dev @studiometa/webpack-config-preset-vue-2
# Or for Vue 3
npm install --save-dev @studiometa/webpack-config-preset-vue-3
```

#### Example

```js
import { defineConfig } from '@studiometa/webpack-config';
import vue from '@studiometa/webpack-config-preset-vue-3';

export default defineConfig({
  presets: [vue()],
});
```

### `withContentHash`

Add content hash to filenames in production.

#### Options

This preset has no options.

#### Example

```js
import { defineConfig } from '@studiometa/webpack-config';
import { withContentHash } from '@studiometa/webpack-config/presets';

export default defineConfig({
  presets: [withContentHash()],
});
```

## Contributing

This project's branches are managed with [Git Flow](https://github.com/petervanderdoes/gitflow-avh), every feature branch must be merged into develop via a pull request.
