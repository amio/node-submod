# submod [![npm version][npm-version-src]][npm-version-href]

A subtitle(ass/srt) toolkit for modifing synchronization, encoding(TBD), etc.

### Install

```shell
$ npm install -g submod
```

### Usage

##### `submod sync <subtitles> <delta>`

Adjust subtitles delay by delta(in seconds), and save to a new file with suffix ".submod".

```shell
# Decrease subtitle delay by 134.7 seconds:
$ submod sync *S5E01*.ass :-134.7

# Increase subtitle delay by 11.1 seconds:
$ submod sync *S5E01*.srt :+11.1
```

### License

[![GitHub license][license-src]](LICENSE)

[license-src]: https://flat.badgen.net/npm/license/submod
[npm-version-src]: https://flat.badgen.net/npm/v/submod
[npm-version-href]: http://www.npmjs.com/package/submod
