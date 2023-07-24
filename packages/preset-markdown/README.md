# @studiometa/webpack-config-preset-markdown

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config-preset-markdown.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config-preset-vue-2)

A preset for [@studiometa/webpack-config](https://github.com/studiometa/webpack-config) to add markdown support to your project.

## Usage

Install the package:

```sh
npm install --save-dev @studiometa/webpack-config-preset-markdown
```

And load the preset in the `meta.config.js` file:

```js
import { defineConfig } from '@studiometa/webpack-config';
import markdown from '@studiometa/webpack-config-preset-markdown';

export default defineConfig({
  presets: [
    markdown(),
  ],
  // ...
});
```

