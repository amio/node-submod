const tape = require('tape')
const shifter = require('../lib/sync-shifter').shift
const fs = require('fs')
const path = require('path')

tape.test('sync-shifter', function (t) {
  //
  t.test('shift srt subtitle', function (tt) {
    tt.ok(typeof shifter === 'function')

    const subtitle = fs.readFileSync(
      path.join(__dirname, './sync-shifter.source.srt'),
      { encoding: 'utf8' }
    )
    const expected = fs.readFileSync(
      path.join(__dirname, './sync-shifter.expected.srt'),
      { encoding: 'utf8' }
    )

    tt.equal(shifter(subtitle, 15123, 'srt'), expected)

    tt.end()
  })

  t.test('shift ass subtitle', function (tt) {
    tt.ok(typeof shifter === 'function')

    const subtitle = fs.readFileSync(
      path.join(__dirname, './sync-shifter.source.ass'),
      { encoding: 'utf8' }
    )
    const expected = fs.readFileSync(
      path.join(__dirname, './sync-shifter.expected.ass'),
      { encoding: 'utf8' }
    )

    tt.equal(shifter(subtitle, -134900, 'ass'), expected)

    tt.end()
  })

})
