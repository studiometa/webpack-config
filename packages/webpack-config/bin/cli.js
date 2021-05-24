#!/usr/bin/env node
const cac = require('cac');
const chalk = require('chalk');

const { version, bin } = require('../package.json');

const cli = cac(Object.keys(bin).pop());
const build = require('../src/build.js');
const dev = require('../src/dev.js');

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
cli.version(version);
try {
  cli.parse();
} catch (err) {
  console.log(chalk.red(err));
}

if (!cli.matchedCommandName && Object.keys(cli.options).length <= 1) {
  cli.outputHelp();
}
