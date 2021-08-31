import HtmlWebpackPlugin from 'html-webpack-plugin';
import glob from 'glob';
import path from 'path';
import merge from 'lodash.merge';
import twigPreset from './twig.js';
import tailwindcssPreset from './tailwindcss.js';
import extendWebpackConfig from '../utils/extend-webpack-config.js';

export default async (config, options) => {
  const opts = merge(
    {
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
    acc[name] = file;
    return acc;
  }, opts.twig.namespaces || {});

  const extendTwig = typeof opts.twig.extend === 'function' ? opts.twig.extend : () => {};
  opts.twig.extend = (Twig) => {
    extendTwig(Twig);

    // Add debug comments
    Twig.Templates.registerParser('twig', (params) => {
      if (params.id) {
        params.data = `
          <!-- BEGIN ${params.id} -->
          ${params.data}
          <!-- END ${params.id} -->
        `;
      }
      return new Twig.Template(params);
    });
  };

  const plugins = glob.sync('./src/templates/pages/**/*.twig').map(
    (file) =>
      new HtmlWebpackPlugin({
        ...opts.html,
        template: file,
        filename: file.replace('./src/templates/pages/', '').replace(/\.twig$/, '.html'),
      })
  );

  await twigPreset(config, opts.twig);
  await tailwindcssPreset(config, opts.tailwindcss);

  config.src = ['./src/css/**/[!_]*.scss', './src/js/app.js', ...(config.src || [])];
  config.dist = config.dist || './dist';
  config.public = config.public || '/';
  config.server = config.server || 'dist';
  config.watch = ['./dist/**/*.html', ...(config.watch || [])];
  config.mergeCSS = true;

  await extendWebpackConfig(config, async (webpackConfig, isDev) => {
    webpackConfig.plugins = [...webpackConfig.plugins, ...plugins];
    if (!isDev) {
      webpackConfig.output.filename = '[name].[contenthash].js';

      const MiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (MiniCssExtractPlugin) {
        MiniCssExtractPlugin.options = Object.assign(MiniCssExtractPlugin.options, {
          filename: '[name].[contenthash].css',
        });
      }
    }
  });
};
