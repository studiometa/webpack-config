/* eslint-disable */
class App {
  constructor(options) {
    this.options = options;
    window.addEventListener('resize', () => {
      document.body.innerHTML += '<br>resize';
    });
    document.body.innerHTML += ' bar';
  }
}

export default new App({ foo: 'bar' });
