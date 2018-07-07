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

const mock = async (t, opts, expected) => {
	const rsp = await t.context.app.register(plugin, opts).inject({
		method: 'get',
		url: '/'
	});
	const header = rsp.headers['x-frame-options'];

	t.is(header, expected);
};

test('default value should be "SAMEORIGIN"', async t => {
	await mock(t, {}, 'SAMEORIGIN');
});

[
	123,
	false,
	null,
	{},
	['ALLOW-FROM', 'http://foobar.com'],
	new String('deny') // eslint-disable-line no-new-wrappers
].forEach(action => {
	test(`should set header to default value for non-string action: ${JSON.stringify(
		action
	)}`, async t => {
		await mock(t, { action }, 'SAMEORIGIN');
	});
});

['', ' ', 'denny', ' deny '].forEach(action => {
	test('should throw error for invalid action', async t => {
		await t.throws(mock(t, { action }));
	});
});

[
	'',
	undefined,
	null,
	false,
	123,
	['http://foobar.com'],
	new String('http://foobar.com') // eslint-disable-line no-new-wrappers
].forEach(domain => {
	test('should throw error for "ALLOW-FROM" with invalid domain', async t => {
		await t.throws(mock(t, { action: 'ALLOW-FROM', domain }));
	});
});

[
	['deny', 'DENY'],
	['DENY', 'DENY'],
	['sameorigin', 'SAMEORIGIN'],
	['SAMEORIGIN', 'SAMEORIGIN'],
	['allow-from', 'ALLOW-FROM http://foobar.com'],
	['ALLOW-FROM', 'ALLOW-FROM http://foobar.com']
].forEach(([action, expected]) => {
	test(`action should be case insensitivity: ${action}`, async t => {
		await mock(t, { action, domain: 'http://foobar.com' }, expected);
	});
});
