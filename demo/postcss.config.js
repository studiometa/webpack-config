const postcssConfig = {
  plugins: [require('tailwindcss'), require('autoprefixer')],
};

if (process.env.NODE_ENV === 'production') {
  postcssConfig.plugins = [
    ...postcssConfig.plugins,
    require('cssnano'),
  ];
}

module.exports = postcssConfig;
