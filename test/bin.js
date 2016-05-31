const tape = require('tape')
const path = require('path')
const execFile = require('child_process').execFile

const pkg = require('../package.json')
const bin = path.join(__dirname, '../', pkg.bin.submod)

tape.test('bin', function (t) {
  t.test('should return the version', function (tt) {
    const expected = 'v' + pkg.version
    execFile('node', [bin, '--version']).stdout.on('data', function (data) {
      tt.equal(data.replace(/\r\n|\n/g, ''), expected)
      tt.end()
    })
  })
})
