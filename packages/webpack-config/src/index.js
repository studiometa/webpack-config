const getMetaConfig = require('./utils/get-config.js');
const getProdWebpackConfig = require('./webpack.prod.config.js');
const getDevWebpackConfig = require('./webpack.dev.config.js');

module.exports = {
  createConfig: (config) => config,
  getWebpackConfig: ({ mode } = { mode: process.env.NODE_ENV }) => {
    const config = getMetaConfig();
    return mode === 'production' ? getProdWebpackConfig(config) : getDevWebpackConfig(config);
  },
};
