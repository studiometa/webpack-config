import Base from '@studiometa/js-toolkit';

// eslint-disable-next-line require-jsdoc
export default class Component extends Base {
  /**
   * Config.
   */
  get config() {
    return {
      name: 'Component',
      component: {
        ComponentFoo: () => import('../foo/Component'),
      },
    };
  }
}
