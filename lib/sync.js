const fs = require('fs')
const chalk = require('chalk')
const shifter = require('./sync-shifter')

module.exports = function (args, options) {
  Promise.resolve({
    args: args,
    opts: options,
  })
  .then(classifyArgs)
  .then(syncSubtitles)
  .catch(function (e) {
    console.error(chalk.red(e))
    process.exit(1)
  })
}

function classifyArgs (vars) {
  //
  const deltaSimple = /^:[+-]\d+(\.\d+){0,1}$/              // :+123.125
  const deltaComplex = /^:[+-](\d+[hms]){1,3}(\d+){0,1}$/i  // :-2m3s125
  const filesPattern = /\.(ass|srt)$/i

  let delta = []
  let files = []

  vars.args.forEach(function (arg) {
    if (filesPattern.test(arg)) {
      if (!arg.match(/\.submod\./)){  // Ignore file output by submod.
        files.push(arg)
      }

    } else if (deltaSimple.test(arg)) {
      //
      let deltaMilliseconds = parseInt(parseFloat(arg.substr(1)) * 1000)
      delta.push(deltaMilliseconds)

    } else if (deltaComplex.test(arg)) {
      let deltaMilliseconds = parseComplexDelta(arg.substr(1))
      delta.push(deltaMilliseconds)
    }
  })

  if (delta.length > 1) throw new Error('Multiple delta!')
  if (delta.length === 0) throw new Error('Delta format incorrect.')
  if (files.length === 0) throw new Error('No matched file.')

  return {
    files: files,
    delta: delta[0],
    opts: vars.opts,
  }
}

function syncSubtitles (vars) {
  //
  let jobs = vars.files.map(function (filename) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, {
        encoding: 'utf8',
      }, function (err, file) {
        if (err) {
          reject(err)
        } else {
          // Make the change
          let meta = {
            filename: filename,
            text: file,
            delta: vars.delta,
          }
          resolve(shiftSubtitle(meta, vars.opts))
        }
      })
    })
  })

  return Promise.all(jobs)
}

function shiftSubtitle (meta, opts) {
  let suffix = '.submod'
  if (opts.force) suffix = ''
  else if (opts.suffix !== undefined) suffix = '.' + opts.suffix
  const submodFilename = meta.filename.replace(/(.\w+)$/, suffix + '$1')

  const subtitleType = meta.filename.match(/(?:ass|srt)$/)[0]

  const shifted = shifter.shift(meta.text, meta.delta, subtitleType)
  fs.writeFileSync(submodFilename, shifted)

  console.log('DONE: %s\n  --> %s', meta.filename, submodFilename)
}

function parseComplexDelta (deltaString) {
  // deltaString should be like '+1h2m3s456' or '-3s2m'
  // split it to [ '1h', '2m', '3s', '456l' ]
  const parts = (deltaString + 'l').match(/(\d+[hmsl])/g)

  const ms = parts.reduce(function (prev, curr) {
    switch (curr.substr(-1)) {
      case 'h':
        return prev + parseInt(curr.slice(0, -1)) * 60 * 60 * 1000
      case 'm':
        return prev + parseInt(curr.slice(0, -1)) * 60 * 1000
      case 's':
        return prev + parseInt(curr.slice(0, -1)) * 1000
      case 'l':
        return prev + parseInt(shifter.charPadding(curr.slice(0, -1), 'right', '0', 3))
    }
  }, 0)

  return parseInt(deltaString.substr(0,1) + ms)

}
