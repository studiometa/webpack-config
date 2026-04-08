# @studiometa/webpack-config-preset-polyfills

[![NPM Version](https://img.shields.io/npm/v/@studiometa/webpack-config-preset-polyfills.svg?style=flat-square)](https://www.npmjs.com/package/@studiometa/webpack-config-preset-polyfills)

A preset for [@studiometa/webpack-config](https://github.com/studiometa/webpack-config) to inject `core-js` polyfills based on actual usage while keeping `esbuild-loader` in the pipeline.

It uses:

- [`@babel/preset-env`](https://babel.dev/docs/babel-preset-env)
- [`@babel/preset-typescript`](https://babel.dev/docs/babel-preset-typescript)
- [`core-js`](https://github.com/zloirock/core-js)

This is useful for runtime APIs that are not syntax transforms, such as `Array.prototype.toReversed()`, `toSorted()`, `toSpliced()` and other modern built-ins that need polyfills on older browsers.

## Install

```sh
npm install --save-dev @studiometa/webpack-config-preset-polyfills
```

You do not need to install `core-js` separately when using this preset. It resolves injected `core-js` imports from the preset package itself.

## Usage

```js
import { defineConfig } from '@studiometa/webpack-config';
import { polyfills } from '@studiometa/webpack-config-preset-polyfills';

export default defineConfig({
  presets: [polyfills()],
});
```

To also polyfill selected npm packages, allowlist them explicitly:

```js
export default defineConfig({
  presets: [
    polyfills({
      includePackages: ['@studiometa/js-toolkit'],
    }),
  ],
});
```

The preset adds a Babel step before `esbuild-loader` using `@babel/preset-env` with `useBuiltIns: 'usage'` to inject matching `core-js` imports automatically.

By default, only standard `core-js` polyfills are injected. You can opt into proposal polyfills with `polyfills({ proposals: true })` when needed.

Polyfill injection is limited to project source files under `src` by default. Use `includePackages` to opt specific dependencies into the Babel polyfill pass.

## Options

- `proposals` (`boolean`, default: `false`)
- `version` (`number | { version: number | string; proposals?: boolean }`, default: installed `core-js` version)
- `includePackages` (`string[]`, default: `[]`): npm packages inside `node_modules` to include in polyfill injection in addition to project `src` files
- `presetEnv` (`Object`, optional): extra options passed to `@babel/preset-env`

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
