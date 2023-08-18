import { Preset } from '@studiometa/webpack-config';

export type Options = {
  remarkOptions?: any;
};

export function markdown(options?: Options): Preset;

export default markdown;
