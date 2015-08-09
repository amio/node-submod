const tape = require('tape')
const shifter = require('../lib/sync-shifter')

tape.test('sync-shifter', function (t) {
  //
  t.test('shift srt subtitle', function (tt) {
    tt.ok(typeof shifter === 'function')
    tt.end()
  })

})
