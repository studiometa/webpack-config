module.exports = (config) => {
  config.src = ['./src/css/**/[!_]*.scss', './src/js/app.js', ...(config.src || [])];
  config.dist = config.dist || './dist';
  config.public = config.public || '/';
  config.server = config.server || 'dist';
  config.watch = ['./dist/**/*.html', ...(config.watch || [])];
};
