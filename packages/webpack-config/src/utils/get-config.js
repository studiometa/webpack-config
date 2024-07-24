import { resolve, dirname, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { findUp } from 'find-up';
import esbuild from 'esbuild';
import extendBrowsersync from './extend-browsersync-config.js';
import extendWebpack from './extend-webpack-config.js';

/**
 * Get config from meta.config.js file.
 * @param   {{ analyze: boolean, mode: 'development'|'production' }} [options] CLI Options.
 * @returns {import('../index').MetaConfig}
 */
export default async function getConfig({ analyze = false, mode = 'production' } = {}) {
  let configPath = await findUp(['meta.config.js', 'meta.config.mjs', 'meta.config.ts']);

  if (!configPath) {
    throw new Error(
      [
        'Could not find a config file.',
        'Is there a meta.config.js file up in the folder tree?',
      ].join('\n'),
    );
  }

  if (configPath.endsWith('.ts')) {
    const configContent = readFileSync(configPath);
    const hash = createHash('md5').update(configContent).digest('hex');
    const result = await esbuild.transform(configContent, {
      loader: 'ts',
    });
    configPath = resolve(dirname(process.env._), `../.cache/meta.config-${hash}.mjs`);
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, result.code);
  }

  const config = await import(configPath).then((mod) => mod.default);
  const isDev = mode !== 'production';

  if (analyze) {
    config.analyze = true;
  }

  config.PATH = configPath;

  if (!config.context) {
    config.context = dirname(configPath);
  }

  if (!isAbsolute(config.context)) {
    config.context = resolve(process.cwd(), config.context);
  }

  if (!config.dist) {
    config.dist = resolve(config.context, './dist');
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
