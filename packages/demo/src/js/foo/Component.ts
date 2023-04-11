import { Base } from '@studiometa/js-toolkit';
import type { BaseTypeParameter } from '@studiometa/js-toolkit';

interface ComponentInterface extends BaseTypeParameter {
  $options: {
    foo: boolean;
  };
  $refs: {
    btn: HTMLButtonElement;
  };
}

export default class Component<T extends BaseTypeParameter = BaseTypeParameter> extends Base<
  T & ComponentInterface
> {
  /**
   * Config.
   */
  static config = {
    name: 'Component',
    options: {
      foo: Boolean,
    },
  };

  mounted() {
    this.$log(this.$options.foo);
    this.$log(this.$refs.btn);
  }
}
