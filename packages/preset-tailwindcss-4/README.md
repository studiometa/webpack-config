# @studiometa/webpack-config-preset-tailwindcss-4

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config-preset-tailwindcss-4.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config-preset-tailwindcss-4)

A preset for [@studiometa/webpack-config](https://github.com/studiometa/webpack-config) to add Tailwind CSS v4 support to your project.

## Usage

Install the package along with Tailwind CSS v4:

```sh
npm install --save-dev @studiometa/webpack-config-preset-tailwindcss-4
npm install --save tailwindcss@4
```

And load the preset in the `meta.config.js` file:

```js
import { defineConfig } from '@studiometa/webpack-config';
import { tailwindcss } from '@studiometa/webpack-config-preset-tailwindcss-4';

export default defineConfig({
  presets: [tailwindcss()],
  // ...
});
```
