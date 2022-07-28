import fs from 'node:fs';
import path from 'node:path';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const pkgPath = path.resolve(dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath));

pkg.peerDependencies = {
  vue: '^2.7.8',
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
