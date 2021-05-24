module.exports = {
  src: [
    './src/js/app.js',
    './src/css/**/[!_]*.scss',
  ],
  dist: 'dist',
  public: '/',
  // Exclude the `test.scss` file from the merge
  mergeCSS: /^(?!.*css\/test\.scss).*$/,
};
