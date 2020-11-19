const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');
const merge = require('lodash.merge');
const twigPreset = require('./twig');
const tailwindcssPreset = require('./tailwindcss');
const extendWebpackConfig = require('../utils/extend-webpack-config.js');

module.exports = (config, options) => {
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

  twigPreset(config, opts.twig);
  tailwindcssPreset(config, opts.tailwindcss);

  config.src = ['./src/css/**/[!_]*.scss', './src/js/app.js', ...(config.src || [])];
  config.dist = config.dist || './dist';
  config.public = config.public || '/';
  config.server = config.server || 'dist';
  config.watch = ['./dist/**/*.html', ...(config.watch || [])];

  extendWebpackConfig(config, (webpackConfig) => {
    webpackConfig.plugins = [...webpackConfig.plugins, ...plugins];
  });
};
