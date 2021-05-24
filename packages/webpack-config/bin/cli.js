#!/usr/bin/env node
import cac from 'cac';
import chalk from 'chalk';
import { createRequire } from 'module';
import build from '../src/build.js';
import dev from '../src/dev.js';

const require = createRequire(import.meta.url);
const { version, name } = require('../package.json');

const cli = cac('meta');

cli
  .command('build', 'Build assets.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .option('--modern', 'Build a modern bundle along the legacy one.')
  .option('--no-legacy', 'Disable the legacy bundle.')
  .action((options = { analyze: false, modern: false }) => {
    build(options);
  });

cli
  .command('dev', 'Launch dev server.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action((options) => {
    dev(options);
  });

cli.help();
cli.version(`${name}@${version}`);

try {
  cli.parse();
} catch (err) {
  console.log(chalk.red(err));
}

if (!cli.matchedCommandName && Object.keys(cli.options).length <= 1) {
  cli.outputHelp();
}
