import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

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
    process.env.PWD,
    'node_modules/.cache/@studiometa/webpack-config/certificates/',
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

/**
 * ESLint plugin preset.
 * @returns {import('./index').Preset}
 */
export default function https() {
  return {
    name: 'https',
    async handler(config, { extendBrowsersync, isDev }) {
      if (!isDev) {
        return;
      }

      await extendBrowsersync(config, (browserSyncConfig) => {
        const { cert, key } = createCertificates();

        // Enable `https://` with browserSync
        if (cert && key) {
          browserSyncConfig.https = {
            cert,
            key,
          };
        }
      });
    },
  };
}
