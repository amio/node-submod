#! /usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const help = require('./help')
const sync = require('./sync')

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
    s: 'suffix',
    f: 'force',
  },
})

if (argv.version) {
  help.printVersion()
} else if (argv.help) {
  help.printHelp()
} else {
  main(argv)
}

function main(argv) {
  switch (argv._[0]) {
    case 'sync':
      sync(argv._.slice(1), argv)
      break
    default:
      help.printHelp()
  }
}
