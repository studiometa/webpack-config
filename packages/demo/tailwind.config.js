module.exports = {
  mode: 'jit',
  purge: ['./src/templates/**/*.twig', './src/js/**/*.js'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
