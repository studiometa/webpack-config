const twigPreset = require('./twig');
const tailwindcssPreset = require('./tailwindcss');

module.exports = (config, options) => {
  twigPreset(config, options.twig || {});
  tailwindcssPreset(config, options.tailwindcss || {});

  config.src = ['./src/css/**/[!_]*.scss', './src/js/app.js', ...(config.src || [])];
  config.dist = config.dist || './dist';
  config.public = config.public || '/';
  config.server = config.server || 'dist';
  config.watch = ['./dist/**/*.html', ...(config.watch || [])];
};
