import { Preset } from '@studiometa/webpack-config';

export type Options = {
  proposals?: boolean;
  version?: number | { version: number | string; proposals?: boolean };
  includePackages?: string[];
  presetEnv?: Record<string, unknown>;
};

export function polyfills(options?: Options): Preset;

export default polyfills;
