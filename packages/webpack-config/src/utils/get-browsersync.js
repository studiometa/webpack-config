import bs from 'browser-sync';
import chalk from 'chalk';

const instance = bs.create();

let WATCH_HANDLERS_BINDED = false;

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
