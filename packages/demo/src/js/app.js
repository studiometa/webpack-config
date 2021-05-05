import Vue from 'vue';
import Base from '@studiometa/js-toolkit';
import VueCounter from './Counter.vue';
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
      Component: () => import('./components/Component'),
    },
  };

  vue;

  /**
   * Mounted hook.
   */
  mounted() {
    this.$log('config', config, this.$options);
    this.content = 'mounted';
    this.vue = new Vue({
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

export default new App(document.querySelector('main')).$mount();