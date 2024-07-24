import { VueLoaderOptions } from 'vue-loader';
import { OptimizeOptions } from 'svgo';
import { Preset } from '@studiometa/webpack-config/presets';

export interface VuePresetOptions {
  vue: VueLoaderOptions;
  svgo: OptimizeOptions;
}

export { Preset }

export function vue(options:VuePresetOptions = {}):Preset;
export default function vue(options:VuePresetOptions = {}):Preset;
