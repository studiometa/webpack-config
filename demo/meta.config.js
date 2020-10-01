module.exports = {
  src: ['./src/js/**/*.js', './src/css/**/[!_]*.scss'],
  dist: './dist',
  public: '/',
  server: 'dist',
  watch: [
    'dist/*.html',
    [
      'dist/*.html',
      (event, file) => {
        console.log(`The "${event}" event was emitted for the file "${file}".`);
      },
    ],
  ],
  webpackDev({ mode, devtool }) {
    console.log('webpackDev', { mode, devtool });
  },
  webpackProd({ mode, devtool }) {
    console.log('webpackProd', { mode, devtool });
  },
  presets: ['twig'],
};
