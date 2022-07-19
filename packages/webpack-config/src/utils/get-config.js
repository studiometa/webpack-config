import { findUp } from 'find-up';
import extendBrowsersync from './extend-browsersync-config.js';
import extendWebpack from './extend-webpack-config.js';

export default async (options = { analyze: false, target: [] }) => {
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

  config.PATH = configPath;

  if (Array.isArray(config.presets) && config.presets.length) {
    console.log('Applying presets...');

    await Promise.all(
      config.presets.map(async (preset) => {
        if (!preset.name && typeof preset.handler !== 'function') {
          console.log('Preset misconfigured.', preset);
          return;
        }

        console.log(`Using the "${preset.name}" preset.`);
        await preset.handler(config, { extendBrowsersync, extendWebpack });
      })
    );
  }

  // Read from command line args first, then meta.config.js, then set default
  if (Array.isArray(options.target) && options.target.length) {
    config.modern = options.target.includes('modern');
    config.legacy = options.target.includes('legacy');
  } else if (config.target) {
    const targetConfig = Array.isArray(config.target) ? config.target : [config.target];
    config.modern = targetConfig.includes('modern');
    config.legacy = targetConfig.includes('legacy');
  } else {
    // Default to only legacy build.
    config.modern = false;
    config.legacy = true;
  }

  if (process.env.NODE_ENV === 'production') {
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
  }

  return config;
};
