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
  .command('sync [files] [delta]')
  .description('Modify synchronization of subtitles, by [delta].')
  .action(sync)
  .option(
    '-f, --force',
    'Save change to original file instead of a new file with suffix.'
  )
  .option(
    '-s, --suffix [suffix]',
    'Add suffix to output filename. default: "submod"'
  )

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
