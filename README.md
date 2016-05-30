# submod [![npm version](https://img.shields.io/npm/v/submod.svg?style=flat-square)](http://www.npmjs.com/package/submod)

A subtitle(ass/srt) toolkit for modifing synchronization, encoding(TBD), etc.

### Install

```bash
npm install -g submod
```

### Usage

##### `submod sync <subtitles> <delta>`

Adjust subtitles delay by delta(in seconds), and save to a new file with suffix ".submod".

```shell
# Decrease subtitle delay by 134.7 seconds:
$ submod sync *S5E01*.ass :-134.7

# Increase subtitle delay by 11.1 seconds:
$ submod sync *S5E01*.ass :+11.1
```

### License

[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
