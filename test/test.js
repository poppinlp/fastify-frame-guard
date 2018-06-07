import test from 'ava';
import fastify from 'fastify';
import plugin from '../src/index';

test.beforeEach(t => {
	const app = fastify();

	app.get('/', (request, reply) => {
		reply.send('hello world');
	});

	t.context.app = app;
});

const testHandler = (t, opts, expectedHeader, params = '') => {
	const { app } = t.context;

	t.plan(3);
	app.register(plugin, opts);
	app.inject(
		{
			method: 'GET',
			url: `/${params}`
		},
		(err, res) => {
			const expected = {
				payload: 'hello world',
				header: expectedHeader
			};
			const target = {
				payload: res.payload,
				header: res.headers['x-frame-options']
			};

			t.is(err, null, 'should throw no error');
			t.is(target.payload, expected.payload, 'should have expected response payload');
			t.is(target.header, expected.header, 'should have expected response header');
			t.end();
		}
	);
};

test.cb('default option', t => {
	testHandler(t, {}, 'SAMEORIGIN');
});

test.cb('set action to DENY', t => {
	testHandler(
		t,
		{
			action: 'deny'
		},
		'DENY'
	);
});

test.cb('set action to allow-from with domain', t => {
	testHandler(
		t,
		{
			action: 'allow-from',
			domain: 'http://www.foobar.com'
		},
		'ALLOW-FROM http://www.foobar.com'
	);
});

test.cb('set allowedDomains with unmatch query', t => {
	testHandler(
		t,
		{
			action: 'allow-from',
			domain: 'http://www.foobar.com',
			allowedDomains: [
				'http://www.notmatch.com'
			]
		},
		'ALLOW-FROM http://www.foobar.com'
	);
});

test.cb('set allowedDomains with match query', t => {
	testHandler(
		t,
		{
			action: 'allow-from',
			domain: 'http://www.foobar.com',
			allowedDomains: [
				'http://www.match.com'
			]
		},
		'ALLOW-FROM http://www.match.com',
		'?domain=http://www.match.com'
	);
});
