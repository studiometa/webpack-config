# @studiometa/webpack-config-preset-prototyping

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config-preset-prototyping.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config-preset-vue-2)

A preset for [@studiometa/webpack-config](https://github.com/studiometa/webpack-config) to add prototyping support to your project. It includes:

- JS or TS
- SCSS and Tailwind CSS
- Twig for templating with file based routing and dynamic data loading

## Usage

Install the package:

```sh
npm install --save-dev @studiometa/webpack-config-preset-prototyping
```

And load the preset in the `meta.config.js` file:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { prototyping } from '@studiometa/webpack-config-preset-prototyping';

export default defineConfig({
  presets: [prototyping()],
  // ...
});
```

## Documentation

### Options

- `ts` (`boolean`): use `app.ts` as entry point instead of `app.js`
- `twig` (`Object`): options for the [`twig` preset](https://github.com/studiometa/webpack-config/#twig)
- `tailwindcss` (`Object`): options for the [`tailwindcss` preset](https://github.com/studiometa/webpack-config/#tailwindcss)
- `html` (`Object`): options for the [`html-webpack-plugin` plugin](https://github.com/jantimon/html-webpack-plugin#options)
- `markdown` (`Object`): options for the [`markdown` preset](https://github.com/studiometa/webpack-config/tree/develop/packages/preset-markdown)

### Examples

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
