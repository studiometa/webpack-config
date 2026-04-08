import { createRequire } from 'node:module';
import browserslist from 'browserslist';

const require = createRequire(import.meta.url);
const { version: corejsVersion } = require('core-js/package.json');

/**
 * @typedef {import('webpack').RuleSetRule} RuleSetRule
 */

/**
 * @param {unknown} target
 * @param {string} context
 * @returns {string[] | undefined}
 */
function resolveTargets(target, context) {
  if (typeof target === 'string' && target.startsWith('browserslist:')) {
    return [target.replace('browserslist:', '').trim()];
  }

  const config = browserslist.loadConfig({ path: context });

  if (Array.isArray(config)) {
    return config;
  }

  if (typeof config === 'string') {
    return [config];
  }
}

/**
 * @param {RuleSetRule[]} rules
 * @returns {RuleSetRule | undefined}
 */
function findJavaScriptRule(rules = []) {
  return rules.find((rule) => {
    return rule?.type === 'javascript/auto' && String(rule?.test) === String(/\.m?(j|t)s$/);
  });
}

/**
 * Polyfills preset.
 * @param   {Options} [options]
 * @returns {import('@studiometa/webpack-config').Preset}
 */
export function polyfills(options = {}) {
  return {
    name: 'polyfills',
    async handler(config, { extendWebpack }) {
      await extendWebpack(config, async (webpackConfig) => {
        const jsRule = findJavaScriptRule(webpackConfig?.module?.rules);

        if (!jsRule) {
          throw new Error('Could not find the default JavaScript rule to extend with polyfills.');
        }

        const jsLoaders = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use].filter(Boolean);
        const targets = resolveTargets(webpackConfig.target, config.context);

        jsRule.use = [
          ...jsLoaders,
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              sourceType: 'unambiguous',
              cacheDirectory: true,
              targets,
              plugins: [
                '@babel/plugin-syntax-typescript',
                [
                  'babel-plugin-polyfill-corejs3',
                  {
                    method: options.method ?? 'usage-global',
                    version: options.version ?? corejsVersion,
                    proposals: options.proposals ?? true,
                    ...options.pluginOptions,
                  },
                ],
              ],
            },
          },
        ];
      });
    },
  };
}

export default polyfills;
