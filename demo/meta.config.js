module.exports = {
  src: ['./src/js/**/*.js', './src/css/**/[!_]*.scss'],
  dist: './dist/',
  public: '/',
  server: true,
  watch: [
    '*.html',
    [
      '*.html',
      (event, file) => {
        console.log(`The "${event}" event was emitted for the file "${file}".`);
      },
    ],
  ],
};
