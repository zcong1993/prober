# prober

[![NPM version](https://img.shields.io/npm/v/@zcong/prober.svg?style=flat)](https://npmjs.com/package/@zcong/prober)
[![NPM downloads](https://img.shields.io/npm/dm/@zcong/prober.svg?style=flat)](https://npmjs.com/package/@zcong/prober)

<!-- [![codecov](https://codecov.io/gh/zcong1993/prober/branch/master/graph/badge.svg)](https://codecov.io/gh/zcong1993/prober) -->

> Server probe manager

## Features

- support `gRPC Health Checking Protocol`
- easy to register http handler for `ready` and `healthy`
- easy to expose status to `prometheus metrics`
- easy to combine multiple probers into one
- easy to implement yours

## Install

```bash
$ yarn add @zcong/prober
# or npm
$ npm i @zcong/prober --save
```

## Usage

see [example/server.ts](./example/server.ts)

## License

MIT &copy; zcong1993
