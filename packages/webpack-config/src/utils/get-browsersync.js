import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import bs from 'browser-sync';
import chalk from 'chalk';

const instance = bs.create();

let WATCH_HANDLERS_BINDED = false;

/**
 * Create certificates on the fly.
 * @returns {{cert?:string,key?:string}}
 */
function createCertificates() {
  try {
    execSync('which mkcert', { encoding: 'utf-8' });
  } catch {
    console.log('mkcert not found, skipping creating SSL certificates.');
    return { cert: null, key: null };
  }
  const cachePath = path.join(
    path.dirname(process.env.npm_package_json),
    'node_modules/.cache/@studiometa/webpack-config/certificates/'
  );

  execSync(`mkdir -p ${cachePath}`);

  const certPath = path.join(cachePath, 'localhost.cert');
  const keyPath = path.join(cachePath, 'localhost.key');

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    return {
      cert: certPath,
      key: keyPath,
    };
  }

  try {
    spawnSync(`mkcert`, [`-cert-file`, certPath, '-key-file', keyPath, 'localhost', '127.0.01']);
  } catch {
    console.log('could not create SSL certificates, continuing...');
    return { cert: null, key: null };
  }

  return {
    cert: certPath,
    key: keyPath,
  };
}

const getConfig = (metaConfig) => {
  const browserSyncConfig = {
    open: false,
    logPrefix: '',
    port: 3042,
    logFileChanges: false,
    logLevel: 'silent',
    notify: {
      styles: [
        'z-index: 99999998',
        'position: fixed',
        'right: 1em',
        'bottom: 1em',
        'display: none',
        'padding: 0.6em 0.8em 0.7em',
        'margin: 0',
        'font-family: JetBrains Mono, Fira Code, monospace',
        'font-size: 12px',
        'font-weight: 400',
        'text-align: center',
        'color: white',
        'background-color: #1B2032',
        'border-radius: 5px',
        'text-transform: capitalize',
      ],
    },
  };

  if (metaConfig.server && typeof metaConfig.server !== 'function') {
    browserSyncConfig.server = metaConfig.server;
  } else {
    browserSyncConfig.proxy =
      process.env.APP_HOST ?? process.env.APP_HOSTNAME ?? process.env.APP_URL;
  }

  if (metaConfig.watch && !WATCH_HANDLERS_BINDED) {
    WATCH_HANDLERS_BINDED = true;
    metaConfig.watch.forEach((glob) => {
      if (Array.isArray(glob) && glob.length >= 2) {
        const [fileGlob, callback] = glob;
        if (typeof callback !== 'function') {
          throw new Error(
            'A watch item should implement the following schema: [glob:string, callback:function]'
          );
        }
        instance.watch(fileGlob, (event, file) => {
          callback(event, file, instance, browserSyncConfig);
        });
      } else {
        instance.watch(glob).on('change', instance.reload);
      }
    });
  }

  const { cert, key } = createCertificates();

  // Enable `https://` with browserSync
  if (cert && key) {
    browserSyncConfig.https = {
      cert,
      key,
    };
  }

  if (typeof metaConfig.server === 'function') {
    metaConfig.server(browserSyncConfig, instance);
  }

  return browserSyncConfig;
};

let config;

export default (metaConfig) => ({
  instance,
  get config() {
    if (!config) {
      config = getConfig(metaConfig);
    }
    return config;
  },
  get getInfo() {
    return () => {
      if (!instance.active) {
        return 'Application not running.\n';
      }

      const url = new URL('http://localhost');
      url.port = instance.getOption('port');
      url.protocol = this.config.https ? 'https://' : 'http://';

      const proxy = instance.getOption('proxy');

      return `Application running at ${chalk.blue(url.toString())}${
        proxy ? chalk.white(` (proxying ${chalk.blue(proxy.get('target'))})`) : ''
      }\n`;
    };
  },
});
