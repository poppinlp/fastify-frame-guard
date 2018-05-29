# fastify-frame-guard

[![Code style][lint-img]][lint-url]
[![Dependency Status][dep-img]][dep-url]
[![Dev Dependency Status][dev-dep-img]][dev-dep-url]
[![NPM version][npm-ver-img]][npm-url]
[![NPM downloads][npm-dl-img]][npm-url]
[![NPM license][npm-lc-img]][npm-url]

Fastify plugin to set the X-Frame-Options header, mitigating things like clickjacking

## Why?

You may know [frameguard](https://github.com/helmetjs/frameguard) as a [frameguard middleware](https://helmetjs.github.io/docs/frameguard/) used in [helmet](https://github.com/helmetjs/helmet). And you could use it as a middleware in fastify also. So why i made this plugin?

Benchmark with no plugin:

```txt
Running 20s test @ http://127.0.0.1:10290/pudge/rest/v0/benchmark
1000 connections

Stat         Avg     Stdev   Max
Latency (ms) 32.37   8.9     1139.09
Req/Sec      30444   1051.31 31048
Bytes/Sec    4.53 MB 170 kB  4.63 MB

609k requests in 20s, 90.7 MB read
```

Benchmark with frameguard as middleware:

```txt
Running 20s test @ http://127.0.0.1:10290/pudge/rest/v0/benchmark
1000 connections

Stat         Avg     Stdev   Max
Latency (ms) 36.25   11.56   1757.27
Req/Sec      27235.2 1100.59 28126
Bytes/Sec    4.83 MB 189 kB  5.01 MB

545k requests in 20s, 97 MB read
```

Benchmark with this plugin:

```txt
Running 20s test @ http://127.0.0.1:10290/pudge/rest/v0/benchmark
1000 connections

Stat         Avg     Stdev   Max
Latency (ms) 29.89   201.7   9976.95
Req/Sec      29270.4 2192.26 30224
Bytes/Sec    5.23 MB 415 kB  5.38 MB

585k requests in 20s, 104 MB read
```

So that's the reason and wish you like it. :)

## Install

Via npm:

```shell
npm i fastify-frame-guard
```

Via yarn:

```shell
yarn add fastify-frame-guard
```

## Usage

```js
const fastify = require('fastify');
const fastifyFrameGuard = require('fastify-frame-guard');

const app = fastify();
app.register(fastifyFrameGuard, {
  // Your options
});

app.listen(3000, err => {
  if (err) throw err;
});
```

## Options

This plugin has all options which the middleware in helmet gives and support a new feature.

### action {string}

Specify the action for this plugin which could be `DENY`, `SAMEORIGIN` or `ALLOW-FROM`. Default is `SAMEORIGIN`. Case insensitivity.

- `DENY`: couldn't be framed
- `SAMEORIGIN`: could only be framed from the same origin
- `ALLOW-FROM`: could be framed from domain which you specified

### domain {string}

Specify the allowed domain for `ALLOW-FROM` action.

### allowedDomains {array}

You could use this option when you have multi allowed domains. If you set this option, this plugin will load the domain param in request url params. Then if the domain param is in your `allowedDomains` list, plugin will set header to allowed that domain. If not, plugin will set header with your `domain` option.

```js
app.register(fastifyHsts, {
  action: 'allow-from',
  domain: 'http://www.foo.com',
  allowedDomains: [
    'http://www.bar.com',
    'http://www.some-third-party-service.com'
  ]
});
```

## Changelog

- 0.1.0: Init version

## Todo

- Add test case
- Add ci
- Add benchmark scripts

[lint-img]: https://img.shields.io/badge/code%20style-handsome-brightgreen.svg?style=flat-square
[lint-url]: https://github.com/poppinlp/eslint-config-handsome
[dep-img]: https://img.shields.io/david/poppinlp/fastify-frame-guard.svg?style=flat-square
[dep-url]: https://david-dm.org/poppinlp/fastify-frame-guard
[dev-dep-img]: https://img.shields.io/david/dev/poppinlp/fastify-frame-guard.svg?style=flat-square
[dev-dep-url]: https://david-dm.org/poppinlp/fastify-frame-guard#info=devDependencies
[npm-ver-img]: https://img.shields.io/npm/v/fastify-frame-guard.svg?style=flat-square
[npm-dl-img]: https://img.shields.io/npm/dm/fastify-frame-guard.svg?style=flat-square
[npm-lc-img]: https://img.shields.io/npm/l/fastify-frame-guard.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fastify-frame-guard
