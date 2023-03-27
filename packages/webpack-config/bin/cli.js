#!/usr/bin/env node
import cac from 'cac';
import chalk from 'chalk';
import { createRequire } from 'module';

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
