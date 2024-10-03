import path from 'node:path';
import { findUp } from 'find-up';
import extendBrowsersync from './extend-browsersync-config.js';
import extendWebpack from './extend-webpack-config.js';

/**
 * Get config from meta.config.js file.
 * @param   {{ analyze: boolean, mode: 'development'|'production' }} [options] CLI Options.
 * @returns {import('../index').MetaConfig}
 */
export default async function getConfig({ analyze = false, mode = 'production' } = {}) {
  const configPath = await findUp(['meta.config.js', 'meta.config.mjs']);

  if (!configPath) {
    throw new Error(
      [
        'Could not find a config file.',
        'Is there a meta.config.js file up in the folder tree?',
      ].join('\n'),
    );
  }

  const { default: config } = await import(configPath);
  const isDev = mode !== 'production';

  if (analyze) {
    config.analyze = true;
  }

  config.PATH = configPath;

  if (!config.context) {
    config.context = path.dirname(configPath);
  }

  if (!path.isAbsolute(config.context)) {
    config.context = path.resolve(process.cwd(), config.context);
  }

  if (!config.dist) {
    config.dist = path.resolve(config.context, './dist');
  }

  if (Array.isArray(config.presets) && config.presets.length) {
    console.log('Applying presets...');

    for (let preset of config.presets) {
      if (typeof preset === 'function') {
        preset = preset(isDev);
      }

      if (!preset) {
        continue;
      }

      if (!preset.name && typeof preset.handler !== 'function') {
        console.log('Preset misconfigured.', preset);

        continue;
      }

      const start = performance.now();

      await preset.handler(config, {
        extendBrowsersync,
        extendWebpack,
        isDev,
      });
      const duration = performance.now() - start;
      console.log(`Using the "${preset.name}" preset (${duration.toFixed(3)}ms)`);
    }
  }

  return config;
}
