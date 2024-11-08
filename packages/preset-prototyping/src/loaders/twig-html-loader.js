import path from 'node:path';
import { createRequire } from 'node:module';
import Twig from 'twig';

const require = createRequire(import.meta.url);
const SOURCE_REGEX = /source\s*\(\s*['"]\s*(\.[^'"]+)['"]\s*\)/g;
const PATH_SEPARATOR_REGEX = /([/\\]+)$/;

/**
 * Normalize namespaces paths.
 * @param   {Record<string, string>} namespaces
 * @returns {Record<string, string>}
 */
function normalizeNamespaces(namespaces) {
  if (namespaces && typeof namespaces !== 'object') {
    throw new Error('namespaces option should be an object');
  }
  const result = namespaces || {};
  Object.keys(result).forEach((key) => {
    if (typeof result[key] === 'string') {
      const value = result[key] + path.sep;
      result[key] = value.replace(PATH_SEPARATOR_REGEX, path.sep);
    }
  });
  return result;
}

/**
 * Transform relative paths to absolute paths.
 * @param   {string} str
 * @param   {string} resourcePath
 * @returns {string}
 */
function relativePathsToAbsolutePathsForSourceFn(str, resourcePath) {
  const resourceDir = path.dirname(resourcePath);

  let result = str;
  let matches;
  let prevSourceFnArg;
  let newSourceFnArg;
  let pattern;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    matches = SOURCE_REGEX.exec(result);
    if (matches === null) {
      break;
    }

    [, prevSourceFnArg] = matches;
    newSourceFnArg = `source('${path.resolve(resourceDir, prevSourceFnArg)}')`;
    pattern = `source\\s*\\(\\s*['"]\\s*${prevSourceFnArg}\\s*['"]\\s*\\)`;
    result = result.replace(new RegExp(pattern, 'g'), newSourceFnArg);
  }

  return result;
}

/**
 * Twig HTML Loader.
 *
 *
 * @see     {https://github.com/radiocity/twig-html-loader}
 * @param   {string} source
 * @returns {void}
 */
function loader(source) {
  this.cacheable();
  const callback = this.async();
  // eslint-disable-next-line no-param-reassign
  source = relativePathsToAbsolutePathsForSourceFn(source, this.resourcePath);

  try {
    const query = this.getOptions() || {};
    const templateFile = require.resolve(this.resourcePath);
    const options = {
      path: templateFile,
      data: source,
      async: true,
      debug: Boolean(query.debug || false),
      trace: Boolean(query.trace || false),
      allowInlineIncludes: Boolean(query.allowInlineIncludes || false),
      rethrow: true,
      namespaces: normalizeNamespaces(query.namespaces),
    };

    Twig.cache(true);

    if (query.functions) {
      Object.entries(query.functions).forEach(([name, fn]) => Twig.extendFunction(name, fn));
    }

    if (query.filters) {
      Object.entries(query.filters).forEach(([name, fn]) => Twig.extendFilter(name, fn));
    }

    if (query.tests) {
      Object.entries(query.tests).forEach(([name, fn]) => Twig.extendTest(name, fn));
    }

    if (query.extend) {
      Twig.extend(query.extend);
    }

    const registry = [];

    Twig.extend((TwigInstance) => {
      const defaultSave = Object.assign(TwigInstance.Templates.save);
      // eslint-disable-next-line no-param-reassign
      TwigInstance.Templates.save = function customSave(template) {
        if (template.path) {
          registry.push(path.normalize(template.path));
        }
        return defaultSave.call(this, template);
      };
    });

    const template = Twig.twig(options);

    const render = async (data) => {
      if (typeof data !== 'object') {
        callback(new Error('data parameter should return an object'));
        return;
      }
      const output = await template.renderAsync(data);
      registry.forEach(this.addDependency);
      Twig.extend((TwigInstance) => {
        TwigInstance.Templates.registry = {};
      });
      callback(null, output);
    };

    if (typeof query.data === 'function') {
      const maybeData = query.data(this);

      if (maybeData instanceof Promise) {
        maybeData.then(render).catch(callback);
      } else {
        render(maybeData);
      }
    } else {
      render(query.data);
    }
  } catch (e) {
    callback(e);
  }
}

export default loader;
