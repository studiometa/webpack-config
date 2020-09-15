const path = require('path');
const instance = require('browser-sync').create();

const getConfig = (metaConfig) => {
  const browserSyncConfig = {
    open: false,
    logPrefix: '',
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
    const APP_HOST = process.env.APP_HOST || process.env.APP_HOSTNAME;
    browserSyncConfig.proxy = APP_HOST;
  }

  if (metaConfig.watch) {
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

  // Enable `https://` with browserSync
  if (
    process.env.APP_SSL &&
    process.env.APP_SSL === 'true' &&
    process.env.APP_SSL_CERT &&
    process.env.APP_SSL_KEY
  ) {
    if (browserSyncConfig.proxy) {
      browserSyncConfig.proxy = `https://${browserSyncConfig.proxy}`;
    }
    browserSyncConfig.https = {
      cert: path.resolve(process.env.APP_SSL_CERT),
      key: path.resolve(process.env.APP_SSL_KEY),
    };
  }

  if (typeof metaConfig.server === 'function') {
    metaConfig.server(browserSyncConfig, instance);
  }

  return browserSyncConfig;
};

module.exports = (metaConfig) => ({
  instance,
  get config() {
    return getConfig(metaConfig);
  },
  get getInfo() {
    return () => {
      if (!instance.active) {
        return 'Application not running.';
      }

      const port = instance.getOption('port');
      const proxy = instance.getOption('proxy');
      const protocol = this.config.https ? 'https://' : 'http://';
      const target = proxy ? proxy.get('target') : `${protocol}localhost`;

      return `Application running at \x1b[34m${target}:${port}\x1b[0m\n`;
    };
  },
});
