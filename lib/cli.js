#! /usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const program = require('commander')
const pkgJson = require('../package.json')

const sync = require('./sync.js')

/**
 * Prepare args & opts
 */
program
  .version(pkgJson.version)

program
  .command('sync [delta] [files]')
  .description('Modify synchronization of subtitles.')
  .option('-s, --suffix [suffix]', 'Add suffix to output filename.')
  .option('-p, --prefix [prefix]', 'Add prefix to output filename.')
  .action(sync)

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
