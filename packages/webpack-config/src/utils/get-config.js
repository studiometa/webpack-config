const path = require('path');
const fs = require('fs');
const findUp = require('find-up');

module.exports = (options = { analyze: false }) => {
  const configPath = findUp.sync(['meta.config.js', 'meta.config.cjs']);

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

  if (Array.isArray(config.presets) && config.presets.length) {
    console.log('Applying presets...');

    config.presets.forEach((preset) => {
      const name = Array.isArray(preset) ? preset[0] : preset;
      const opts = Array.isArray(preset) ? preset[1] : {};
      const presetPath = path.resolve(__dirname, `../presets/${name}.js`);

      if (!fs.existsSync(presetPath)) {
        console.error(`The "${name}" preset is not available.`);
        return;
      }

      console.log(`Using the "${name}" preset.`);

      // eslint-disable-next-line import/no-dynamic-require
      const presetHandler = require(presetPath);
      presetHandler(config, opts);
    });
  }

  return config;
};
