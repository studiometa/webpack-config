const findUp = require('find-up');

module.exports = (options) => {
  const configPath = findUp.sync('meta.config.js');

  if (!configPath) {
    throw new Error(
      [
        'Could not find a config file.',
        'Is there a meta.config.js file up in the folder tree?',
      ].join('\n')
    );
  }

  // eslint-disable-next-line import/no-dynamic-require
  const config = require(configPath);

  if (options.analyze) {
    config.analyze = true;
  }

  config.PATH = configPath;

  return config;
};
