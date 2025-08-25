/**
 * With hash preset.
 * @returns {import('./index').Preset}
 */
export default function hash() {
  return {
    name: 'hash',
    async handler(config, { extendWebpack, isDev }) {
      if (isDev) {
        return;
      }

      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.plugins.push(new HashPlugin());
      });
    },
  };
}

/**
 * WebpackPlugin.
 * @template {any} T
 */
class WebpackPlugin {
  /**
   * Plugin name.
   */
  static name = 'WebpackPlugin';

  /**
   * @type {T}
   */
  options = {};

  /**
   * Constructor.
   * @type {T}
   */
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * [apply description]
   * @param   {[type]} compiler [description]
   * @returns {[type]}          [description]
   */
  apply(compiler) {
    console.log(`Using the "${this.constructor.name}" plugin`);
    return compiler;
  }
}

/**
 * HashPlugin.
 */
export class HashPlugin extends WebpackPlugin {
  static name = 'HashPlugin';

  /**
   * Apply.
   * @param   {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    super.apply(compiler);
    compiler.hooks.beforeRun.tap(HashPlugin.name, () => {
      compiler.options.output.filename = '[name].[contenthash].js';
    });
  }
}
