import { sync as globSync } from 'glob';
import { extname, resolve, join } from 'path';

/**
 * Generate an object of entries from a given glob and current workin directory
 * @param  {String} glob    The glob of files to find
 * @param  {String} cwd     The source path of the files
 * @param  {Object} options Options passed to the globSync method
 * @return {Object}         An object of entries
 */
function findEntriesByGlob(glob, cwd, options = {}) {
  return globSync(glob, { ...options, cwd }).reduce((entries, filepath) => {
    const ext = extname(filepath).replace(/^\./, '');
    const regexp = new RegExp(`\\.${ext}$`);
    const entryName = filepath.replace(`${cwd}/`, '').replace(regexp, '');
    entries[entryName] = resolve(join(cwd, filepath));
    return entries;
  }, {});
}

/**
 * Generate an object of entries from the given globs
 * @param  {String|Array} glob    The glob of files to find
 * @param  {String}       cwd     The source path of the files
 * @param  {Object}       options Options passed to the globSync method
 * @return {Object}               An object of entries
 */
export default function findEntriesByGlobs(glob, cwd, options = {}) {
  if (Array.isArray(glob)) {
    const negatives = [];
    let allEntries = {};

    glob.forEach(singleGlob => {
      const isNegative = singleGlob.startsWith('!');
      const absoluteGlob = isNegative ? singleGlob.substring(1) : singleGlob;
      const entries = findEntriesByGlob(absoluteGlob, cwd, options);

      if (isNegative) {
        negatives.push(...Object.keys(entries));
      }

      allEntries = {
        ...allEntries,
        ...entries,
      };
    });

    // Filter out all negatives matches before returning
    return Object.entries(allEntries).reduce((entries, [key, path]) => {
      if (negatives.includes(key)) {
        return entries;
      }

      entries[key] = path;
      return entries;
    }, {});
  }

  return findEntriesByGlob(glob, cwd, options);
}
