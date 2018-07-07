const fp = require('fastify-plugin');

const frameGuard = (app, opts, next) => {
	const DIRECTIVE_SET = new Set(['DENY', 'SAMEORIGIN', 'ALLOW-FROM']);
	const directive = typeof opts.action === 'string' ? opts.action.toUpperCase() : 'SAMEORIGIN';
	const isAllowed = directive === 'ALLOW-FROM';

	if (!DIRECTIVE_SET.has(directive)) {
		next(new Error(`No such action: ${directive}`));
		return;
	}
	if (isAllowed && (typeof opts.domain !== 'string' || opts.domain.length === 0)) {
		next(new TypeError('ALLOW-FROM action requires a non-empty domain string.'));
		return;
	}

	const header = isAllowed ? `${directive} ${opts.domain}` : directive;

	app.addHook('onSend', (request, reply, payload, next) => {
		reply.header('X-Frame-Options', header);
		next();
	});

	next();
};

module.exports = fp(frameGuard, {
	fastify: '^1.0.0',
	name: 'fastify-frame-guard'
});
