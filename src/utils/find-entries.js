import { sync as globSync } from 'glob';
import path from 'path';

/**
 * Generate an object of entries from a src and a glob
 * @param  {String} src  The source of the files
 * @param  {String} glob The glob of files to find
 * @return {Object}      An object of entries
 */
export default (src, glob = '**/*.js') =>
  globSync(path.resolve(src, glob)).reduce((entries, filepath) => {
    const filename = path.basename(filepath);

    if (filename.startsWith('_')) {
      return entries;
    }

    const extname = path.extname(filepath).replace(/^\./, '');
    const regexp = new RegExp(`\\.${extname}$`);
    const entryName = filepath.replace(`${src}/`, '').replace(regexp, '');
    entries[entryName] = filepath;

    return entries;
  }, {});
