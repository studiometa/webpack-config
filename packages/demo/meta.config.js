module.exports = {
  presets: ['prototyping', 'yaml'],
  // Exclude the `test.scss` file from the merge
  mergeCSS: /^(?!.*css\/test\.scss).*$/,
};
