import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import merge from 'lodash.merge';
import twigPreset from './twig.js';
import tailwindcssPreset from './tailwindcss.js';
import hash from './hash.js';
import Html from '../utils/Html.js';

const LEADING_SLASH_REGEX = /^\//;
const TWIG_FILE_REGEX = /\.twig$/;
const TWIG_TAG_END_HTML_ELEMENT_REGEX = /^end_html_element/;
const TWIG_TAG_HTML_ELEMENT_REGEX = /^html_element\s+(.+?)(?:\s+|$)(?:with\s+([\S\s]+?))?$/;

/**
 * Prototyping preset.
 * @param   {{ tailwindcss?: any, twig?: any, html?: any }} options
 * @returns {import('./index').Preset}
 */
export default function prototyping(options) {
  return {
    name: 'prototyping',
    async handler(config, { extendWebpack, extendBrowsersync, isDev }) {
      const twigContext = {};
      const opts = merge(
        {
          ts: false,
          tailwindcss: {},
          twig: {
            data: async (context) => {
              const resourceDir = path.dirname(context.resourcePath);
              const resourceFilename = path.basename(context.resourcePath);
              let data = {};
              const query = new URLSearchParams(context.resourceQuery);
              const params = query.has('params') ? JSON.parse(query.get('params')) : null;

              // Try to get data from JS or TS file
              const dataLoaderPaths = ['.ts', '.js'].map((extension) =>
                path.join(resourceDir, resourceFilename.replace(/\.twig$/, extension))
              );
              const dataLoaderPath =
                query.get('data') ??
                dataLoaderPaths.find((potentialDataLoaderPath) =>
                  fs.existsSync(potentialDataLoaderPath)
                );

              if (dataLoaderPath) {
                context.addDependency(dataLoaderPath);
                const loader = await context.importModule(dataLoaderPath);
                data = await loader.data({ ...twigContext, params });
              }

              // Try to get content from MD file
              const contentLoaderPath =
                query.get('content') ??
                path.join(resourceDir, resourceFilename.replace(/\.twig$/, '.md'));

              if (fs.existsSync(contentLoaderPath)) {
                context.addDependency(contentLoaderPath);
                const loader = await context.importModule(contentLoaderPath);
                // Markdown is treated as raw for now
                data.content = loader;
              }

              return { ...twigContext, ...data, page: { params } };
            },
          },
          html: {
            template: './src/templates/index.twig',
            scriptLoading: 'defer',
          },
        },
        options
      );

      const templateContext = path.resolve(config.context, 'src/templates');
      const pageContext = path.resolve(templateContext, 'pages');

      opts.twig.namespaces = glob
        .sync('*', { cwd: templateContext, absolute: true })
        .reduce((acc, file) => {
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
          regex: TWIG_TAG_END_HTML_ELEMENT_REGEX,
          next: [],
          open: false,
        });

        Twig.exports.extendTag({
          type: 'html_element',
          regex: TWIG_TAG_HTML_ELEMENT_REGEX,
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
            const namespace = Object.entries(params.options.namespaces).find(([, value]) =>
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

      // We need a more robuts resolution here, this part should be considered as the router.
      // ./src/pages/[single].twig -> will be rendered with {{ content }} read from MD files in ./src/content/*.md and additional {{ _context }} from ./src/server/[single].js
      // ./src/pages/index.twig -> will be rendered with {{ _context }} read from ./src/server/index.js
      // ./src/pages/about.twig -> will be rendered with {{ _context }} read from ./src/server/about.js
      // ./src/pages/[...].twig -> will be rendered with {{ _context }} read from ./src/server/[...].js
      //
      // For every dynamic route, test if other MD of JS file exists and generate a template from them.
      // With the following input:
      // - ./src/pages/[single].twig
      // - ./src/pages/about.md
      // The following file will be generated:
      // - dist/about.html, rendered with the content of about.md and the template of [single.twig]
      const pageRoot = path.resolve('./src/templates/pages');
      const dynamicRouteRegex = /\[([^\]]*)\]/g;
      const twigExtensionRegex = /\.twig$/;
      const templateExtensionsRegex = /\.(twig|js|ts|md)$/;

      const twigTemplates = glob.sync('**/*.twig', { cwd: pageRoot });
      const twigTemplatesWithoutExtension = new Set(
        twigTemplates.map((twigTemplate) => twigTemplate.replace(twigExtensionRegex, ''))
      );
      const jsTemplates = new Set(
        glob
          .sync('**/*.js', { cwd: pageRoot })
          .map((filepath) => filepath.replace(templateExtensionsRegex, ''))
      );
      const tsTemplates = new Set(
        glob
          .sync('**/*.ts', { cwd: pageRoot })
          .map((filepath) => filepath.replace(templateExtensionsRegex, ''))
      );
      const markdownTemplates = new Set(
        glob
          .sync('**/*.md', { cwd: pageRoot })
          .map((filepath) => filepath.replace(templateExtensionsRegex, ''))
      );

      const plugins = twigTemplates.flatMap((file) => {
        const dynamicMatches = file.match(dynamicRouteRegex);
        const templatePath = path.resolve(path.join(pageRoot, file));
        if (!dynamicMatches) {
          return new HtmlWebpackPlugin({
            ...opts.html,
            template: templatePath,
            filename: file.replace(twigExtensionRegex, '.html'),
            alwaysWriteToDisk: true,
          });
        }

        const dynamicFilesGlob = file
          .replace(dynamicRouteRegex, '*')
          .replace(twigExtensionRegex, '.{md,js,ts}');
        const dynamicFiles = new Set(
          glob
            .sync(dynamicFilesGlob, { cwd: pageRoot })
            .filter((maybeFile) => {
              const maybeFileWithoutExtension = maybeFile.replace(templateExtensionsRegex, '');
              return !twigTemplatesWithoutExtension.has(maybeFileWithoutExtension);
            })
            .map((dynamicFile) => dynamicFile.replace(templateExtensionsRegex, ''))
        );

        const fileParamsRegex = new RegExp(
          file.replace(twigExtensionRegex, '').replace(dynamicRouteRegex, '(?<$1>.*)')
        );

        // Add dynamic folders
        if (file.endsWith('index.twig')) {
          const dynamicFoldersGlob = `${path.dirname(file).replace(dynamicRouteRegex, '*')}/`;
          const dynamicFolders = glob.sync(dynamicFoldersGlob, { cwd: pageRoot });
          dynamicFolders.forEach((dynamicFolder) => {
            if (!dynamicRouteRegex.test(dynamicFolder)) {
              dynamicFiles.add(path.join(dynamicFolder, 'index'));
            }
          });
        }

        return Array.from(dynamicFiles).map((dynamicFile) => {
          const params = new URLSearchParams();
          const absoluteDynamicFile = path.join(pageRoot, dynamicFile);
          const matches = dynamicFile.match(fileParamsRegex);

          if (matches && matches.groups) {
            params.set('params', JSON.stringify(matches.groups));
          }

          if (jsTemplates.has(dynamicFile)) {
            params.set('data', `${absoluteDynamicFile}.js`);
          } else if (tsTemplates.has(dynamicFile)) {
            params.set('data', `${absoluteDynamicFile}.ts`);
          }

          if (markdownTemplates.has(dynamicFile)) {
            params.set('content', `${absoluteDynamicFile}.md`);
          }

          return new HtmlWebpackPlugin({
            ...opts.html,
            template: `${templatePath}?${params}`,
            filename: `${dynamicFile}.html`,
            alwaysWriteToDisk: true,
          });
        });
      });

      twigContext.site = {
        links: plugins.map((html) => `/${html.userOptions.filename}`),
      };

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

      const { handler: withContentHashHandler } = hash(opts.tailwindcss);
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
