import fs from 'fs';
import { findUp } from 'find-up';

export default async (options = { analyze: false, modern: undefined, legacy: undefined }) => {
  const configPath = await findUp(['meta.config.js', 'meta.config.mjs']);

  if (!configPath) {
    throw new Error(
      [
        'Could not find a config file.',
        'Is there a meta.config.js file up in the folder tree?',
      ].join('\n')
    );
  }

  const { default: config } = await import(configPath);

  if (options.analyze) {
    config.analyze = true;
  }

  config.modern = options.modern === true ? true : config.modern ?? false;
  config.legacy = options.legacy === false ? false : config.legacy ?? true;

  if (!config.modern && !config.legacy) {
    throw new Error('Can not disable both legacy and modern bundles.');
  }

  if (config.modern && config.legacy) {
    console.log('Building modern and legacy bundles.');
  } else if (config.modern && !config.legacy) {
    console.log('Building modern bundle.');
  } else {
    console.log('Building legacy bundle.');
  }

  config.PATH = configPath;

  if (Array.isArray(config.presets) && config.presets.length) {
    console.log('Applying presets...');

    await Promise.all(
      config.presets.map(async (preset) => {
        const name = Array.isArray(preset) ? preset[0] : preset;
        const opts = Array.isArray(preset) ? preset[1] : {};
        const presetPathInfo = new URL(`../presets/${name}.js`, import.meta.url);

        if (!fs.existsSync(presetPathInfo.pathname)) {
          console.error(`The "${name}" preset is not available.`);
          return;
        }

        console.log(`Using the "${name}" preset.`);

        const { default: presetHandler } = await import(presetPathInfo.pathname);
        await presetHandler(config, opts);
      })
    );
  }

  return config;
};
