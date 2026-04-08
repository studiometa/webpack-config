import { Base, createApp } from '@studiometa/js-toolkit';

const demoToReversedValues = [1, 2, 3].toReversed();

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
  };

  mounted() {
    this.$log(demoToReversedValues);
  }
}

export default createApp(App, document.querySelector('main'));
