import { Preset } from '@studiometa/webpack-config';

export type Options = {
  method?: 'usage-global' | 'usage-pure' | 'entry-global';
  proposals?: boolean;
  version?: string;
  pluginOptions?: Record<string, unknown>;
};

export function polyfills(options?: Options): Preset;

export default polyfills;
