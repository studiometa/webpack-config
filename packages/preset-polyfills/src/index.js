import path from 'node:path';
import { createRequire } from 'node:module';
import browserslist from 'browserslist';

const require = createRequire(import.meta.url);
const corejsPackagePath = require.resolve('core-js/package.json');
const { version: corejsVersion } = require(corejsPackagePath);
const corejsPath = path.dirname(corejsPackagePath);

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
 * @param {string} context
 * @param {string[]} [includePackages]
 * @returns {(string | RegExp)[]}
 */
function resolveIncludedPaths(context, includePackages = []) {
  return [
    path.resolve(context, 'src'),
    ...includePackages.map((packageName) => {
      const escapedPackageName = packageName.replaceAll('/', '[\\/]');
      return new RegExp(`[\\/]node_modules[\\/]${escapedPackageName}[\\/]`);
    }),
  ];
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

        const targets = resolveTargets(webpackConfig.target, config.context);
        const include = resolveIncludedPaths(config.context, options.includePackages);

        webpackConfig.resolve ??= {};
        webpackConfig.resolve.alias ??= {};
        webpackConfig.resolve.alias['core-js'] ??= corejsPath;

        webpackConfig.module.rules.unshift({
          test: jsRule.test,
          type: jsRule.type,
          include,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                sourceType: 'unambiguous',
                cacheDirectory: true,
                targets,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      bugfixes: true,
                      modules: false,
                      useBuiltIns: 'usage',
                      corejs: options.version ?? {
                        version: corejsVersion,
                        proposals: options.proposals ?? false,
                      },
                      targets,
                      ...options.presetEnv,
                    },
                  ],
                  '@babel/preset-typescript',
                ],
              },
            },
          ],
        });
      });
    },
  };
}

export default polyfills;
