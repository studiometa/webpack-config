const getMetaConfig = require('./utils/get-config.js');
const getWebpackConfig = require('./webpack.prod.config.js');

module.exports = {
  createConfig: (config) => config,
  getWebpackConfig: () => {
    const config = getMetaConfig();
    return getWebpackConfig(config);
  },
};
