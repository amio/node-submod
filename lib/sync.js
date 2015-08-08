'use strict'

const fs = require('fs')
const shifter = require('./sync-shifter')

module.exports = function (delta, files, options) {
  //
  // there is a bug in commander: tj/commander.js#386
  // so use options.parent.rawArgs instead of options.parent.args
  const vars = {
    args: options.parent.rawArgs.slice(3),
    opts: options,
  }

  Promise.resolve(vars)
    .then(classifyArgs)
    .then(syncSubtitles)
    .catch(function (e) {
      console.log(e)
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
    if (arg.match(filesPattern)) {
      if (!arg.match(/\.submod\./))  // Ignore file output by submod.
        files.push(arg)

    } else if (arg.match(deltaSimple)) {
      //
      let deltaMilliseconds = parseInt(parseFloat(arg.substr(1)) * 1000)
      delta.push(deltaMilliseconds)

    } else if (arg.match(deltaComplex)) {
      // todo: compute complex delta
      delta.push(arg)
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
        encoding: 'utf8'
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
  else if  (opts.suffix !== undefined) suffix = '.' + opts.suffix
  const submodFilename = meta.filename.replace(/(.\w+)$/, suffix + '$1')

  const subtitleType = meta.filename.match(/(?:ass|srt)$/)[0]

  const shifted = shifter(meta.text, meta.delta, subtitleType)

  fs.writeFileSync(submodFilename, shifted)

  console.log('Done: %s --> %s', meta.filename, submodFilename)
}
