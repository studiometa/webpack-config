import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import merge from 'lodash.merge';
import twigPreset from './twig.js';
import tailwindcssPreset from './tailwindcss.js';
import withContentHash from './withContentHash.js';
import Html from '../utils/Html.js';

/**
 * Prototyping preset.
 * @param   {{ tailwindcss?: any, twig?: any, html?: any }} options
 * @returns {import('./index').Preset}
 */
export default function prototyping(options) {
  return {
    name: 'prototyping',
    async handler(config, { extendWebpack, extendBrowsersync, isDev }) {
      const opts = merge(
        {
          ts: false,
          tailwindcss: {},
          twig: {},
          html: {
            template: './src/templates/index.twig',
            scriptLoading: 'defer',
          },
        },
        options
      );

      opts.twig.namespaces = glob.sync('./src/templates/*/').reduce((acc, file) => {
        const name = path.basename(file);
        acc[name] = path.resolve(file);
        return acc;
      }, opts.twig.namespaces || {});

      const extendTwig = typeof opts.twig.extend === 'function' ? opts.twig.extend : () => {};
      opts.twig.functions = {
        ...(opts?.twig?.functions || {}),
        // eslint-disable-next-line camelcase
        html_styles(styles) {
          return Html.renderStyleAttribute(styles);
        },
        // eslint-disable-next-line camelcase
        html_attributes(attributes) {
          return Html.renderAttributes(attributes);
        },
        // eslint-disable-next-line camelcase
        html_classes(classes) {
          return Html.renderClass(classes);
        },
      };

      opts.twig.extend = (Twig) => {
        extendTwig(Twig);

        Twig.exports.extendTag({
          type: 'end_html_element',
          regex: /^end_html_element/,
          next: [],
          open: false,
        });

        Twig.exports.extendTag({
          type: 'html_element',
          regex: /^html_element\s+(.+?)(?:\s+|$)(?:with\s+([\S\s]+?))?$/,
          next: ['end_html_element'],
          open: true,
          compile(token) {
            const { match } = token;
            const expression = match[1].trim();
            const withContext = match[2];

            delete token.match;

            token.stack = Twig.expression.compile.call(this, {
              type: Twig.expression.type.expression,
              value: expression,
            }).stack;

            if (withContext !== undefined) {
              token.withStack = Twig.expression.compile.call(this, {
                type: Twig.expression.type.expression,
                value: withContext.trim(),
              }).stack;
            }

            return token;
          },
          parse(token, context, chain) {
            const tag = Twig.expression.parse.call(this, token.stack, context);
            const attributes = token.withStack
              ? Twig.expression.parse.call(this, token.withStack, context)
              : undefined;
            const content = this.parse(token.output, context);
            const output = Html.renderTag(tag, attributes, content);

            return {
              chain,
              output,
            };
          },
        });

        // Add debug comments
        Twig.Templates.registerParser('twig', (params) => {
          if (params.id) {
            const namespace = Object.entries(params.options.namespaces).find(([key, value]) =>
              params.id.startsWith(value)
            );
            let tpl = params.id;

            if (namespace) {
              const [namespaceName, namespacePath] = namespace;
              tpl = tpl.replace(namespacePath, `@${namespaceName}/`);
            } else {
              tpl = path.relative(process.cwd(), tpl);
            }

            params.data = `
              <!-- BEGIN ${tpl} -->
              ${params.data}
              <!-- END ${tpl} -->
            `;
          }
          return new Twig.Template(params);
        });
      };

      const plugins = glob.sync('./src/templates/pages/**/*.twig').map(
        (file) =>
          new HtmlWebpackPlugin({
            ...opts.html,
            template: path.resolve(file),
            filename: file.replace('./src/templates/pages/', '').replace(/\.twig$/, '.html'),
            alwaysWriteToDisk: true,
          })
      );

      if (!isDev && fs.existsSync(path.resolve('./public'))) {
        plugins.push(
          // Public assets
          new FileManagerPlugin({
            events: {
              onEnd: {
                copy: [{ source: './public/', destination: './dist/' }],
              },
            },
          })
        );
      }

      const { handler: twigPresetHandler } = twigPreset(opts.twig);
      await twigPresetHandler(config, { extendWebpack, extendBrowsersync, isDev });
      const { handler: tailwindcssPresetHandler } = tailwindcssPreset(opts.tailwindcss);
      await tailwindcssPresetHandler(config, { extendWebpack, extendBrowsersync, isDev });

      config.src = [
        opts.ts ? './src/js/app.ts' : './src/js/app.js',
        './src/css/**/[!_]*.scss',
        ...(config.src ?? []),
      ];
      config.dist = config.dist ?? './dist';
      config.public = config.public ?? '/';
      config.server = config.server ?? ['dist', 'public'];
      config.watch = ['./dist/**/*.html', ...(config.watch ?? [])];
      config.mergeCSS = config.mergeCSS ?? true;
      config.target = config.target ?? ['modern'];

      const { handler: withContentHashHandler } = withContentHash(opts.tailwindcss);
      await withContentHashHandler(config, { extendWebpack, extendBrowsersync, isDev });

      await extendWebpack(config, async (webpackConfig) => {
        webpackConfig.plugins = [...webpackConfig.plugins, ...plugins];
        if (isDev) {
          webpackConfig.plugins.push(new HtmlWebpackHarddiskPlugin());
        }
      });
    },
  };
}
