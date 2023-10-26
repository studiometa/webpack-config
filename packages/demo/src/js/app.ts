import { Base, createApp } from '@studiometa/js-toolkit';
import { Cursor } from '@studiometa/ui';
import { createApp as createVueApp } from 'vue';
import VueComponent from './VueComponent.vue';
import config from '@/js/config.yaml';
import configRaw from './config.yaml?raw';

/**
 * App class.
 * @license MIT © 2020 Studio Meta
 */
class App extends Base {
  /**
   * App configuration.
   */
  static config = {
    name: 'App',
    log: true,
    refs: ['content', 'vue'],
    ...config,
    components: {
      Cursor,
      // eslint-disable-next-line import/extensions
      Component: () => import(/* webpackPrefetch: true */ './components/Component.js'),
    },
  };

  vue;

  VueComponent;

  /**
   * Mounted hook.
   */
  async mounted() {
    this.$log('config', config, configRaw, this.$options);
    this.content = 'mounted';
    this.VueComponent = VueComponent;
  }

  /**
   * Load the Vue app on click.
   */
  async onClick() {
    if (this.vue) {
      return;
    }

    const { default: VueCounter } = await import(/* webpackPreload: true */ './Counter.vue');
    this.vue = createVueApp(VueCounter);
    this.vue.mount(this.$refs.vue);
  }

  /**
   * Resized hook.
   */
  resized() {
    this.content = 'resized';
  }

  /**
   * Set the component's content.
   * @param {string} value The content to add.
   */
  set content(value) {
    this.$refs.content.innerHTML += `<br>${value}`;
  }
}

export default createApp(App, document.querySelector('main'));
