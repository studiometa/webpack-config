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
import prototyping from '@studiometa/webpack-config-preset-prototyping';

export default defineConfig({
  presets: [
    prototyping(),
  ],
  // ...
});
```

## Documentation

@todo
