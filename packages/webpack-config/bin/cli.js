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
