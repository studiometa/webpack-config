/* eslint-disable no-restricted-syntax, no-continue, no-await-in-loop */
/**
 * @link https://github.com/studiometa/twig-toolkit
 * @copyright Studio Meta
 * @license https://github.com/studiometa/twig-toolkit/blob/master/LICENSE
 */
import { paramCase } from 'param-case';

/**
 * @typdef {string | Record<string, boolean> | Record<number, Classes>} Classes
 */

/**
 * Html class.
 */
export default class Html {
  static SELF_CLOSING_TAGS = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];

  /**
   * Render classes.
   * @param  {Classes} classes
   * @returns {string}
   */
  static renderClass(classes) {
    if (!classes) {
      return '';
    }

    if (typeof classes === 'string') {
      return classes;
    }

    if (Array.isArray(classes)) {
      return classes.map((c) => Html.renderClass(c)).join(' ');
    }

    return Object.entries(classes)
      .reduce((acc, [key, value]) => {
        if (value && key !== '_keys') {
          acc.push(key);
        }

        return acc;
      }, [])
      .join(' ');
  }

  /**
   * Render a style attribute.
   * @param  {Record<string, string|number>} styles
   * @returns {string}
   */
  static renderStyleAttribute(styles) {
    if (!styles) {
      return '';
    }

    const renderedStyles = [];

    for (const [key, value] of Object.entries(styles)) {
      if (key === '_keys' || (typeof value === 'boolean' && !value) || value === '') {
        continue;
      }
      renderedStyles.push(`${paramCase(key)}: ${value};`);
    }
    return renderedStyles.join(' ');
  }

  /**
   * Render attributes.
   *
   * @param  {Record<string, any>} attributes
   * @returns {string}
   */
  static renderAttributes(attributes) {
    if (!attributes) {
      return '';
    }

    const renderedAttributes = [''];

    for (let [key, value] of Object.entries(attributes)) {
      if (key === '_keys') {
        continue;
      }

      key = paramCase(key);
      if (typeof value === 'boolean') {
        if (value) {
          renderedAttributes.push(key);
        }
        continue;
      }
      if (key === 'class') {
        value = Html.renderClass(value);
      }
      if (key === 'style' && typeof value !== 'string') {
        value = Html.renderStyleAttribute(value);
      }
      if (typeof value !== 'string') {
        if (value instanceof Map) {
          value = JSON.stringify(Html.mapToObject(value));
        } else {
          value = JSON.stringify(value);
        }
      }

      renderedAttributes.push(`${key}='${value}'`);
    }

    return renderedAttributes.join(' ');
  }

  /**
   * Merge HTML attributes with sane defaults.
   *
   * @param   {Record<string, any>} [attributes]
   * @param   {Record<string, any>} defaultAttributes
   * @param   {Record<string, any>} requiredAttributes
   * @returns {Record<string, any>}
   */
  static mergeAttributes(attributes = {}, defaultAttributes = {}, requiredAttributes = {}) {
    // Merge `class` attributes before the others
    requiredAttributes.class = [
      attributes.class ?? defaultAttributes.class ?? '',
      requiredAttributes.class ?? '',
    ].filter(Boolean);

    // Remove the `class` attribute if empty
    if (requiredAttributes.class.length < 1) {
      delete requiredAttributes.class;
    }

    return { ...defaultAttributes, ...attributes, ...requiredAttributes };
  }

  /**
   * Convert a map to an object.
   *
   * @param  {Map} map
   * @returns {Record<string, any>}
   */
  static mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      if (value instanceof Map) {
        obj[key] = Html.mapToObject(value);
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }

  /**
   * Render a tag.
   *
   * @param  {string} name
   * @param  {Record<string, any>} attributes
   * @param  {string} content
   * @returns {string}
   */
  static renderTag(name, attributes, content = '') {
    const formattedAttributes = Html.renderAttributes(attributes);
    if (Html.SELF_CLOSING_TAGS.includes(name)) {
      return `<${name}${formattedAttributes} />`;
    }
    return `<${name}${formattedAttributes}>\n${content}\n</${name}>`;
  }
}
