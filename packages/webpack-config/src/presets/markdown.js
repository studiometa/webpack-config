import merge from 'lodash.merge';
import RemarkHTML from 'remark-html';

let isUsed = false;

/**
 * YAML loader preset.
 *
 * @see     https://github.com/webpack-contrib/remark-loader
 * @param   {any} [options]
 * @returns {import('./index').Preset}
 */
export default function markdown(options = {}) {
  const opts = merge(
    {
      remarkOptions: {
        plugins: [[RemarkHTML, { sanitize: false }]],
      },
    },
    options
  );

  return {
    name: 'markdown',
    async handler(config, { extendWebpack }) {
      if (isUsed) {
        return;
      }

      isUsed = true;
      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.module.rules.push(
          {
            test: /\.md$/,
            type: 'asset/source',
            resourceQuery(input = '') {
              return !input.includes('frontmatter');
            },
            use: [
              {
                loader: 'remark-loader',
                options: opts,
              },
            ],
          },
          {
            test: /\.md$/,
            resourceQuery: /frontmatter/,
            type: 'json',
            use: [
              {
                loader: 'front-matter-loader',
                options: {
                  onlyAttributes: true,
                },
              },
            ],
          }
        );
      });
    },
  };
}
