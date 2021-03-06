import Base from '@studiometa/js-toolkit';
import './Component.css';

// eslint-disable-next-line require-jsdoc
export default class Component extends Base {
  /**
   * Config.
   */
  static config = {
    name: 'Component',
    components: {
      ComponentFoo: () => import('../foo/Component'),
    },
  };
}
