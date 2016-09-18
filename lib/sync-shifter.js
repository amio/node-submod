module.exports = {
  shift: shifter,
  charPadding: charPadding
}

const TIME_FORMAT = {
  'ass': '0:00:00.00',
  'srt': '00:00:00,000'
}

const TIME_PATTERN = {
  'ass': /\b\d+:\d{2}:\d{2}\.\d{2}(?=,)/g,
  'srt': /\b\d{2}:\d{2}:\d{2},\d{3}\b/g
}

/**
 * Shifter
 *
 * @param {String} text  The subtitle text.
 * @param {Number} delta Time, in ms.
 * @param {String} type  'ass' or 'srt'
 */
function shifter (text, delta, type) {
  const pattern = TIME_PATTERN[type]

  function replaceFn (timestamp) {
    const oldTime = timestamp2ms(timestamp)
    const newTime = oldTime + delta
    return ms2Timestamp(newTime, TIME_FORMAT[type])
  }

  return text.replace(pattern, replaceFn)
}

function timestamp2ms (timestamp) {
  const timeSegments = timestamp.split(/[:.,]/)
  if (timeSegments[3].length === 2) timeSegments[3] += '0'
  const ms = parseInt(timeSegments[3], 10)
  const s = 0 +
    parseInt(timeSegments[2], 10) +
    parseInt(timeSegments[1] * 60, 10) +
    parseInt(timeSegments[0] * 60 * 60, 10)

  return s * 1000 + ms
}

function ms2Timestamp (ms, format) {
  var timeLeft = ms < 0 ? 0 : ms
  var segments = []

  segments.unshift(timeLeft % 1000)   // Milliseconds
  timeLeft = parseInt(timeLeft / 1000, 10)
  segments.unshift(timeLeft % 60)     // Seconds
  timeLeft = parseInt(timeLeft / 60, 10)
  segments.unshift(timeLeft % 60)     // Minutes
  timeLeft = parseInt(timeLeft / 60, 10)
  segments.unshift(timeLeft % 60)     // Hours

  segments[0] = charPadding(segments[0], 'left', '0', 2)  // Hours
  segments[1] = charPadding(segments[1], 'left', '0', 2)  // Minitues
  segments[2] = charPadding(segments[2], 'left', '0', 2)  // Seconds
  segments[3] = charPadding(segments[3], 'left', '0', 3) // Milliseconds

  var timestamp = segments
    .slice(0, 3)
    .join(':')

  switch (format) {
    case TIME_FORMAT['ass']:
      timestamp = timestamp.slice(1) + '.' + segments[3].slice(0, 2)
      break
    case TIME_FORMAT['srt']:
      timestamp += (',' + segments[3])
  }

  return timestamp
}

function charPadding (origin, direction, char, length) {
  const gap = length - origin.toString().length
  if (gap > 0) {
    var padding = new Array(gap + 1).join(char)
    switch (direction) {
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
