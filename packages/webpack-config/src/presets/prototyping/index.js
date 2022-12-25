import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import merge from 'lodash.merge';
import minimatch from 'minimatch';
import { collect } from 'collect.js';
import twigPreset from '../twig.js';
import tailwindcssPreset from '../tailwindcss.js';
import yamlPreset from '../yaml.js';
import hash from '../hash.js';
import Html from '../../utils/Html.js';

const dirname = path.dirname(new URL(import.meta.url).pathname);

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
          twig: {},
          html: {
            template: './src/templates/index.twig',
            scriptLoading: 'defer',
          },
          yaml: {},
        },
        options
      );

      opts.twig.data = async (context) => {
        const resourceDir = path.dirname(context.resourcePath);
        const resourceFilename = path.basename(context.resourcePath);
        const query = new URLSearchParams(context.resourceQuery);

        const href = query.get('href');
        const page = twigContext.pages.firstWhere('meta.href', href);

        let globalContext = {};
        if (typeof options?.twig?.data === 'function') {
          globalContext = await options.twig.data(twigContext);
        } else if (typeof options?.twig?.data === 'string') {
          const dataPath = path.resolve(options.twig.data);
          context.addDependency(dataPath);
          const loader = await context.importModule(dataPath);
          globalContext =
            dataPath.endsWith('.yml') || dataPath.endsWith('.yaml')
              ? loader
              : await loader.data(twigContext);
        } else if (options?.twig?.data) {
          globalContext = options.twig.data;
        }

        const localContext = {
          ...globalContext,
          // eslint-disable-next-line camelcase
          is_dev: isDev,
          site: {
            ...twigContext,
            page,
          },
          pages(q) {
            if (!q) {
              return twigContext.pages;
            }

            return twigContext.pages.filter((p) => {
              return minimatch(p.href, q);
            });
          },
          content: '',
        };

        // Try to get data from JS, TS or YAML file
        const dataLoaderPaths = ['.ts', '.js', '.yml'].map((extension) =>
          path.join(resourceDir, resourceFilename.replace(/\.twig$/, extension))
        );
        const dataLoaderPath =
          query.get('data') ??
          dataLoaderPaths.find((potentialDataLoaderPath) => fs.existsSync(potentialDataLoaderPath));

        let data;
        if (dataLoaderPath) {
          context.addDependency(dataLoaderPath);
          const loader = await context.importModule(dataLoaderPath);
          data =
            dataLoaderPath.endsWith('.yml') || dataLoaderPath.endsWith('.yaml')
              ? loader
              : await loader.data(localContext);
        }

        // Try to get content from MD file
        const contentLoaderPath =
          query.get('content') ??
          path.join(resourceDir, resourceFilename.replace(/\.twig$/, '.md'));

        if (fs.existsSync(contentLoaderPath)) {
          context.addDependency(contentLoaderPath);
          const loader = await context.importModule(contentLoaderPath);
          // Markdown is treated as raw for now
          localContext.content = loader;
        }

        return { ...data, ...localContext };
      };

      opts.twig.namespaces = glob.sync('./src/templates/*/').reduce((acc, file) => {
        const name = path.basename(file);
        acc[name] = path.resolve(file);
        return acc;
      }, opts.twig.namespaces || {});

      opts.twig.namespaces['pkg-layouts'] = path.resolve(dirname, 'layouts');

      // @todo wait for support of multiple path by namespace in twig.js
      // opts.twig.namespaces.layouts = [
      //   ...(Array.isArray(opts.twig.namespaces.layouts)
      //     ? opts.twig.namespaces.layouts
      //     : [opts.twig.namespaces.layouts]),
      //   path.resolve(dirname, './layouts'),
      // ].filter(Boolean);

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
        // eslint-disable-next-line camelcase
        merge_html_attributes(attributes = {}, defaultAttributes = {}, requiredAttributes = {}) {
          return Html.mergeAttributes(attributes, defaultAttributes, requiredAttributes);
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
      const indexHtmlRegex = /\/index\.html$/;
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
          const stats = fs.statSync(templatePath);
          const filename = file.replace(twigExtensionRegex, '.html');
          const params = new URLSearchParams({
            href: `/${filename}`.replace(indexHtmlRegex, '/'),
          });
          return new HtmlWebpackPlugin({
            ...opts.html,
            template: `${templatePath}?${params}`,
            templateParameters: {
              updatedAt: stats.mtime,
              createdAt: stats.birthtime,
              template: file,
              ...Object.fromEntries(params.entries()),
              params: {},
            },
            filename,
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

          const stats = fs.statSync(params.get('content') ?? params.get('data') ?? templatePath);
          const filename = `${dynamicFile}.html`;
          params.set('href', `/${filename}`.replace(indexHtmlRegex, '/'));
          return new HtmlWebpackPlugin({
            ...opts.html,
            template: `${templatePath}?${params}`,
            templateParameters: {
              createdAt: stats.birthtime,
              updatedAt: stats.mtime,
              template: file,
              ...Object.fromEntries(params.entries()),
              params: JSON.parse(JSON.stringify(matches.groups)),
            },
            filename,
            alwaysWriteToDisk: true,
          });
        });
      });

      twigContext.pages = collect(plugins).map((html) => ({
        href: html.userOptions.templateParameters.href,
        meta: html.userOptions.templateParameters,
      }));

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
      const { handler: yamlPresetHandler } = yamlPreset(opts.yaml);
      await yamlPresetHandler(config, { extendWebpack, extendBrowsersync, isDev });

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

      const { handler: withContentHashHandler } = hash();
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
