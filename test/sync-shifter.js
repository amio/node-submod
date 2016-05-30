const tape = require('tape')
const shifter = require('../lib/sync-shifter').shift
const fs = require('fs')
const path = require('path')

tape.test('sync-shifter', function (t) {
  t.test('is a function', function (tt) {
    tt.ok(typeof shifter === 'function', 'Correct shifter module type.')
    tt.end()
  })

  t.test('shift srt subtitle', function (tt) {
    const subtitle = fs.readFileSync(
      path.join(__dirname, './sync-shifter.source.srt'),
      { encoding: 'utf8' }
    )
    const expected = fs.readFileSync(
      path.join(__dirname, './sync-shifter.expected.srt'),
      { encoding: 'utf8' }
    )

    const result = shifter(subtitle, 15123, 'srt')
    tt.equal(result, expected, 'Increase srt subtitle delay by 15.123 seconds.')

    tt.end()
  })

  t.test('shift ass subtitle', function (tt) {
    const subtitle = fs.readFileSync(
      path.join(__dirname, './sync-shifter.source.ass'),
      { encoding: 'utf8' }
    )
    const expected = fs.readFileSync(
      path.join(__dirname, './sync-shifter.expected.ass'),
      { encoding: 'utf8' }
    )

    const result = shifter(subtitle, -134900, 'ass')
    tt.equal(result, expected, 'Decrease ass subtitle delay by 134.9 seconds.')

    tt.end()
  })

})
