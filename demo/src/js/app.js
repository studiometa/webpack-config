import { Base } from '@studiometa/js-toolkit/';

/**
 * App class.
 * @license MIT © 2020 Studio Meta
 */
class App extends Base {
  /**
   * Mounted hook.
   */
  mounted() {
    this.content = 'mounted';
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
    this.$el.innerHTML += `<br>${value}`;
  }
}

export default new App(document.body);
