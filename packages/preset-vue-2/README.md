# @studiometa/webpack-config-preset-vue-2

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config-preset-vue-2.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config-preset-vue-2)

A preset for [@studiometa/webpack-config](https://github.com/studiometa/webpack-config) to add Vue 2 support to your project.

## Usage

Install the package along with Vue:

```sh
npm install --save-dev @studiometa/webpack-config-preset-vue-2
npm install --save vue@2
```

And load the preset in the `meta.config.js` file:

```js
import { defineConfig } from '@studiometa/webpack-config';
import vue from '@studiometa/webpack-config-preset-vue-2';

export default defineConfig({
  presets: [
    vue(),
  ],
  // ...
});
```
