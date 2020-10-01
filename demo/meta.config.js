module.exports = {
  watch: [
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
  presets: ['twig', 'prototyping'],
};
