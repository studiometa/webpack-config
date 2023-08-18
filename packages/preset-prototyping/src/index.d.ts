import { Preset, TailwindcssOptions, YamlOptions } from '@studiometa/webpack-config/preset';
import { Options as MarkdownOptions } from '@studiometa/webpack-config-preset-markdown';
import { Twig } from 'twig';

export type TwigOptions = {
  data?: Record<string, any>;
  debug?: boolean;
  trace?: boolean;
  namespaces?: Record<string, string>;
  functions?: Record<string, (...args:any[]) => any>;
  filters?: Record<string, (...args:any[]) => any>;
  tests?: Record<string, (...args:any[]) => any>;
  extend?: (Twig:Twig) => void;
};

export type Options = {
  ts?: boolean;
  tailwindcss?: TailwindcssOptions;
  twig?: TwigOptions;
  html?: any;
  yaml?: YamlOptions;
  markdown?: MarkdownOptions;
}

export function twig(options?:TwigOptions): Preset;

export function prototyping(options?:Options): Preset;

export default prototyping;
