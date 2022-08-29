#!/usr/bin/env node
import cac from 'cac';
import chalk from 'chalk';
import { createRequire } from 'module';
import build from '../src/build.js';
import dev from '../src/dev.js';
import watch from '../src/watch.js';

const require = createRequire(import.meta.url);
const { version, name } = require('../package.json');

const cli = cac('meta');

cli
  .command('build', 'Build assets.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .option('-t, --target <target>', 'Define targets to bundle for: `legacy` or `modern` or both.')
  .action(({ analyze = false, target = [] } = {}) => {
    const options = { analyze, target: Array.isArray(target) ? target : [target] };
    build(options);
  });

cli
  .command('dev', 'Launch dev server.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action((options) => {
    dev(options);
  });

cli
  .command('watch', 'Watch and build assets on change.')
  .option('-a, --analyze', 'Analyze bundle(s).')
  .action((options) => {
    watch(options);
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
