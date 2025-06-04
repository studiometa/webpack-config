import merge from 'lodash.merge';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const loader = require.resolve('../loaders/twig-html-loader.js');

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
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: {
                  /**
                   * Filter URLs to resolve and bundle.
                   * @see     https://github.com/webpack-contrib/html-loader#sources
                   * @param   {string}  attribute The HTML attribute.
                   * @param   {string}  value     The URL.
                   * @returns {boolean}           Wether to resolve the URL or not.
                   */
                  urlFilter(attribute, value) {
                    if (
                      value.startsWith('/') ||
                      value.startsWith('//') ||
                      value.startsWith('http://') ||
                      value.startsWith('https://')
                    ) {
                      return false;
                    }

                    return true;
                  },
                },
              },
            },
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
