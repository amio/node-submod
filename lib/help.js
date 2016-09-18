const path = require('path')

const helpText = `
  Usage

    $ submod <command> <file> <delta>

  Commands

    sync  Modify synchronization of subtitles by <delta>(in seconds).

    Options

    -s, --suffix <suffix> Save to a new file with <suffix>('submod' by default).
    -f, --force           Save to original file.

    Examples

      # Decrease subtitle delay by 134.7 seconds:
      $ submod sync *S5E01*.ass :-134.7

      # Increase subtitle delay by 11.1 seconds:
      $ submod sync *S5E01*.srt :+11.1
`

module.exports = {
  printHelp: function () {
    process.stdout.write(helpText)
    return true
  },
  printVersion: function () {
    const version = 'v' + require(path.join(__dirname, '../package.json')).version
    process.stdout.write(version + '\n')
    return true
  }
}
