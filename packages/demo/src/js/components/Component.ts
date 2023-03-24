import { Base } from '@studiometa/js-toolkit';
import type { BaseProps } from '@studiometa/js-toolkit';
import './Component.scss';
import type ComponentFoo from '../foo/Component.js';

interface ComponentInterface extends BaseProps {
  $children: {
    ComponentFoo: Promise<ComponentFoo>[];
  };
  $refs: {
    btn: HTMLButtonElement;
  };
}

export default class Component<T extends BaseProps = BaseProps> extends Base<
  T & ComponentInterface
> {
  static config = {
    name: 'Component',
    components: {
      ComponentFoo: () => import('../foo/Component.js'),
    },
  };

  async mounted() {
    const foo = await this.$children.ComponentFoo[0];
    console.log(foo.$options.foo, foo.$refs.btn);
  }
}
