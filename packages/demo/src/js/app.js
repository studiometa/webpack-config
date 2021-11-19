import { createApp as createVueApp } from 'vue';
import { Base, createApp } from '@studiometa/js-toolkit';
import { Cursor } from '@studiometa/ui';
import VueComponent from './VueComponent.vue';
import config from './config.yaml';

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
      Component: () => import('./components/Component.js'),
    },
  };

  vue;

  VueComponent;

  /**
   * Mounted hook.
   */
  mounted() {
    this.$log('config', config, this.$options);
    this.content = 'mounted';
    this.VueComponent = VueComponent;
  }

  /**
   * Load the Vue app on click.
   */
  async onClick() {
    const { default: VueCounter } = await import(/* webpackPreload: true */ './Counter.vue');
    this.vue = createVueApp({
      components: {
        VueCounter,
      },
      render: (h) => h('VueCounter'),
    });
    this.vue.$mount(this.$refs.vue);
  }

  /**
   * Resized hook.
   */
  resized() {
    this.content = 'resized';
  }

  /**
   * Set the component's content.
   * @param {String} value The content to add.
   */
  set content(value) {
    this.$refs.content.innerHTML += `<br>${value}`;
  }
}

export default createApp(App, document.querySelector('main'));
