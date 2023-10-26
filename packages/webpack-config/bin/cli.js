#!/usr/bin/env node
import cac from 'cac';
import chalk from 'chalk';
import { cwd } from 'node:process';
import { symlinkSync, existsSync, readlinkSync, lstatSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { withTrailingSlash } from '../src/utils/index.js';

const require = createRequire(import.meta.url);
const { version, name } = require('../package.json');

const fullVersion = `${name}@${version}`;
const cli = cac('meta');

cli
  .command('build', 'Build assets.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .option('-t, --target <target>', 'Define targets to bundle for: `legacy` or `modern` or both.')
  .action(async ({ analyze = false, target = [] } = {}) => {
    const { default: build } = await import('../src/build.js');
    console.log(chalk.green(fullVersion), chalk.white('meta build'), '\n');
    const options = { analyze, target: Array.isArray(target) ? target : [target] };
    build(options).catch((error) => {
      if (error && !error.compilation) {
        console.log(error);
      }
      process.exit(1);
    });
  });

cli
  .command('dev', 'Launch dev server.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action(async (options) => {
    const { default: dev } = await import('../src/dev.js');
    console.log(chalk.green(fullVersion), chalk.white('meta dev'), '\n');
    dev(options);
  });

cli
  .command('watch', 'Watch and build assets on change.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action(async (options) => {
    const { default: watch } = await import('../src/watch.js');
    console.log(chalk.green(fullVersion), chalk.white('meta watch'), '\n');
    watch(options);
  });

cli
  .command('link <path>', 'Link the given folder to the given alias (default "@").')
  .option('-a, --alias <name>', 'The alias name')
  .action(async (path, { alias = '@' }) => {
    const target = resolve(cwd(), path);
    const symlink = resolve(cwd(), 'node_modules', alias);

    if (existsSync(symlink)) {
      const stat = lstatSync(symlink);

      if (!stat.isSymbolicLink()) {
        console.log(chalk.red(`A folder named "${alias}" already exists, choose another name with the "--link" parameter.`));
        process.exit(1);
      }

      const existingSymlink = readlinkSync(symlink);
      if (existingSymlink !== target) {
        console.log(chalk.red(`A symlink named "${alias}" already exists, choose another name with the "--link" parameter.`));
        process.exit(1);
      } else {
        console.log(`You can now use "${chalk.green(withTrailingSlash(alias))}" as an alias for the "${chalk.green(withTrailingSlash(path))}" folder.`);
        return;
      }
    }

    symlinkSync(target, symlink);
    console.log(`You can now use "${chalk.green(withTrailingSlash(alias))}" as an alias for the "${chalk.green(withTrailingSlash(path))}" folder.`);
  });

cli.help();
cli.version(fullVersion);

try {
  cli.parse();
} catch (err) {
  console.log(chalk.red(err));
}

if (!cli.matchedCommandName && Object.keys(cli.options).length <= 1) {
  cli.outputHelp();
}
