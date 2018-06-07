# fastify-frame-guard

[![Build Status][ci-img]][ci-url]
[![Code coverage][cov-img]][cov-url]
[![Code style][lint-img]][lint-url]
[![Dependency Status][dep-img]][dep-url]
[![Dev Dependency Status][dev-dep-img]][dev-dep-url]
[![NPM version][npm-ver-img]][npm-url]
[![NPM downloads][npm-dl-img]][npm-url]
[![NPM license][npm-lc-img]][npm-url]

Fastify plugin to set the X-Frame-Options header, mitigating things like clickjacking

## Why?

You may know [frameguard](https://github.com/helmetjs/frameguard) as a [frameguard middleware](https://helmetjs.github.io/docs/frameguard/) used in [helmet](https://github.com/helmetjs/helmet). And you could use it as a middleware in fastify also. So why i made this plugin?

You may find the reason in [benchmark result](./benchmarks/benchmark.txt) and wish you like it. :)

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

This plugin has all options which the middleware in helmet gives and support a new option `allowedDomains`.

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

- 0.2.0
  - Add test case
  - Add code coverage
  - Add benchmarks
- 0.1.0:
  - Init version

[ci-img]: https://img.shields.io/travis/poppinlp/fastify-frame-guard.svg?style=flat-square
[ci-url]: https://travis-ci.org/poppinlp/fastify-frame-guard
[cov-img]: https://img.shields.io/coveralls/poppinlp/fastify-frame-guard.svg?style=flat-square
[cov-url]: https://coveralls.io/github/poppinlp/fastify-frame-guard?branch=master
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
