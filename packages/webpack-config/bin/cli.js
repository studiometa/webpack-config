#!/usr/bin/env node
import cac from 'cac';
import chalk from 'chalk';
import { createRequire } from "module";
import build from '../src/build.js';
import dev from '../src/dev.js';

const require = createRequire(import.meta.url);
const { version, name } = require('../package.json');

const cli = cac('meta');

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
cli.version(`${name}@${version}`);
cli.parse();

if (!cli.matchedCommandName && Object.keys(cli.options).length <= 1) {
  cli.outputHelp();
}
