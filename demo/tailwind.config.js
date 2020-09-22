module.exports = {
  purge: ['./index.html', './src/js/**/*.js'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
