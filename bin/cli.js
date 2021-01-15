#!/usr/bin/env node --experimental-json-modules --experimental-import-meta-resolve
import cac from 'cac';
import chalk from 'chalk';
import pkg from '../package.json';
import build from '../src/build.js';
import dev from '../src/dev.js';

const { version, bin } = pkg;
const cli = cac(Object.keys(bin).pop());

cli
  .command('build', 'Build assets.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action(options => {
    try {
      build(options);
    } catch (err) {
      console.log('');
      console.log(chalk.red(err));
      console.log('');
    }
  });

cli
  .command('dev', 'Launch dev server.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action(options => {
    try {
      dev(options);
    } catch (err) {
      console.log('');
      console.log(chalk.red(err));
      console.log('');
    }
  });

cli.help();
cli.version(version);
cli.parse();

if (!cli.matchedCommandName && Object.keys(cli.options).length <= 1) {
  cli.outputHelp();
}
