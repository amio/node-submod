'use strict'

module.exports = shifter

function shifter (text, delta) {
  const timestampPattern = /\d+:\d{2}:\d{2}\.\d{2,3}(?=,)/g
  return text.replace(timestampPattern, genTimestampShifter(delta))
}

function genTimestampShifter (delta) {
  return function (timestamp) {
    const oldTime = timestamp2ms(timestamp)
    const newTime = oldTime + delta
    return ms2Timestamp(newTime, '0:00:00.00')
  }
}

function timestamp2ms (timestamp) {
  const timeSegments = timestamp.split(/[:.]/)
  if (timeSegments[3].length === 2) timeSegments[3] += '0'

  const ms = parseInt(timeSegments[3])
  const s = 0
    + parseInt(timeSegments[2])
    + parseInt(timeSegments[1] * 60)
    + parseInt(timeSegments[0] * 60 * 60)

  return s * 1000 + ms
}

function ms2Timestamp (ms, format) {
  let timeLeft = ms < 0 ? 0 : ms
  let segments = []

  segments.unshift(timeLeft % 1000)   // Milliseconds
  timeLeft = parseInt(timeLeft / 1000)
  segments.unshift(timeLeft % 60)     // Seconds
  timeLeft = parseInt(timeLeft / 60)
  segments.unshift(timeLeft % 60)     // Minutes
  timeLeft = parseInt(timeLeft / 60)
  segments.unshift(timeLeft % 60)     // Hours

  segments[0] = charPadding(segments[0], 'left', '0', 2)  // Hours
  segments[1] = charPadding(segments[1], 'left', '0', 2)  // Minitues
  segments[2] = charPadding(segments[2], 'left', '0', 2)  // Seconds
  segments[3] = charPadding(segments[3], 'right', '0', 3) // Milliseconds

  let timestamp = segments
    .slice(0, 3)
    .join(':')

  switch (format) {
    case '0:00:00.00':    // SSA, AAS
      timestamp = timestamp.slice(1)
        + '.'
        + segments[3].slice(0, 2)
      break
    case '00:00:00,000':  // SRT
      timestamp += (',' + segments[3])
  }

  return timestamp
}

function charPadding (origin, pos, char, length) {
  const gap = length - origin.toString().length
  if (gap > 0) {
    let padding = new Array(gap + 1).join(char)
    switch (pos) {
      case 'suffix':
      case 'right':
        return origin + padding
      case 'prefix':
      case 'left':
        return padding + origin
    }
  }
  return origin.toString()
}
