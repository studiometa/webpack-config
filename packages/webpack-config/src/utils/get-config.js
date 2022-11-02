import { findUp } from 'find-up';
import extendBrowsersync from './extend-browsersync-config.js';
import extendWebpack from './extend-webpack-config.js';

/**
 * Get config from meta.config.js file.
 *
 * @param   {{ analyze: boolean, target: Array<'modern'|'legacy'> }} [options] CLI Options.
 * @returns {import('../index').MetaConfig}
 */
export default async function getConfig({ analyze = false, target = [] } = {}) {
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

  if (analyze) {
    config.analyze = true;
  }

  config.PATH = configPath;

  if (Array.isArray(config.presets) && config.presets.length) {
    console.log('Applying presets...');

    // eslint-disable-next-line no-restricted-syntax
    for (const preset of config.presets) {
      if (!preset.name && typeof preset.handler !== 'function') {
        console.log('Preset misconfigured.', preset);
        return;
      }

      console.log(`Using the "${preset.name}" preset.`);

      // eslint-disable-next-line no-await-in-loop
      await preset.handler(config, {
        extendBrowsersync,
        extendWebpack,
        isDev: process.env.NODE_ENV !== 'production',
      });
    }
  }

  // Read from command line args first, then meta.config.js, then set default
  if (Array.isArray(target) && target.length) {
    config.modern = target.includes('modern');
    config.legacy = target.includes('legacy');
  } else if (config.target) {
    const targetConfig = Array.isArray(config.target) ? config.target : [config.target];
    config.modern = targetConfig.includes('modern');
    config.legacy = targetConfig.includes('legacy');
  } else {
    // Default to only modern build.
    config.modern = true;
    config.legacy = false;
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
}
