import merge from 'lodash.merge';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const loader = require.resolve('../loaders/twig-html-loader.cjs');

/**
 * Twig preset.
 * @param   {{ data: Record<string, any> }} [options]
 * @returns {import('./index').Preset}
 */
export default function twig(options = {}) {
  return {
    name: 'twig',
    async handler(config, { extendWebpack }) {
      const opts = merge({ data: {} }, options);

      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.twig$/,
          type: 'asset/source',
          use: [
            {
              loader,
              options: opts,
            },
          ],
        });
      });
    },
  };
}
