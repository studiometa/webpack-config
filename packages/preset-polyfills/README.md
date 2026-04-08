# @studiometa/webpack-config-preset-polyfills

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config-preset-polyfills.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config-preset-polyfills)

A preset for [@studiometa/webpack-config](https://github.com/studiometa/webpack-config) to inject `core-js` polyfills based on actual usage while keeping `esbuild-loader` in the pipeline.

It uses:

- [`babel-plugin-polyfill-corejs3`](https://github.com/babel/babel-polyfills)
- [`core-js`](https://github.com/zloirock/core-js)

This is useful for runtime APIs that are not syntax transforms, such as `Array.prototype.toReversed()`, `toSorted()`, `toSpliced()` and other modern built-ins that need polyfills on older browsers.

## Install

```sh
npm install --save-dev @studiometa/webpack-config-preset-polyfills
```

## Usage

```js
import { defineConfig } from '@studiometa/webpack-config';
import { polyfills } from '@studiometa/webpack-config-preset-polyfills';

export default defineConfig({
  presets: [polyfills()],
});
```

The preset adds a Babel analysis step before `esbuild-loader` to detect used built-ins and inject matching `core-js` imports automatically.

## Options

- `method` (`'usage-global' | 'usage-pure' | 'entry-global'`, default: `'usage-global'`)
- `proposals` (`boolean`, default: `true`)
- `version` (`string`, default: installed `core-js` version)
- `pluginOptions` (`Object`, optional): extra options passed to `babel-plugin-polyfill-corejs3`

## Browser targets

Polyfill injection depends on your browser targets. The preset resolves targets from:

1. the webpack target when it uses the `browserslist:` syntax;
2. otherwise the Browserslist config found in the current project.

For example, to support older iOS Safari versions:

```json
{
  "browserslist": [
    "> 0.2%",
    "last 4 versions",
    "not dead",
    "iOS >= 14"
  ]
}
```
