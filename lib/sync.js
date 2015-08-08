'use strict'

const fs = require('fs')
const shifter = require('./sync-shifter')

module.exports = function (delta, files, options) {
  //
  // there is a bug in commander: tj/commander.js#386
  // so use options.parent.rawArgs instead of options.parent.args
  const args = options.parent.rawArgs.slice(3)

  Promise.resolve(args)
    .then(classifyArgs)
    .then(syncSubtitles)
    .catch(function (e) {
      console.log(e)
    })
}

function classifyArgs (args) {
  //
  const deltaSimple = /^:[+-]\d+(\.\d+){0,1}$/              // :+123.125
  const deltaComplex = /^:[+-](\d+[hms]){1,3}(\d+){0,1}$/i  // :-2m3s125
  const filesPattern = /\.(ass|srt)$/i

  let delta = []
  let files = []

  args.forEach(function (arg) {
    if (arg.match(filesPattern)) {
      if(!arg.match(/\.submod\./))  // Ignore file output by submod.
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
  }
}

function syncSubtitles (argsObj) {
  //
  let jobs = argsObj.files.map(function (filename) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, {
        encoding: 'utf8'
      }, function (err, file) {
        if (err) {
          reject(err)
        } else {
          let meta = {
            filename: filename,
            text: file,
            delta: argsObj.delta
          }
          resolve(shiftSubtitle(meta))
        }
      })
    })
  })

  return Promise.all(jobs)
}

function shiftSubtitle (meta) {
  const shifted = shifter(meta.text, meta.delta)
  const newFilename = meta.filename.replace(/(.\w+)$/, '.submod$1')
  fs.writeFileSync(newFilename, shifted)
  console.log('Done: %s --> %s', meta.filename, newFilename)
}
