const fp = require('fastify-plugin');

const frameGuard = (app, opts, next) => {
	const ALLOW_KEY_WORD = 'ALLOW-FROM';
	const DEFAULT_ACTION = 'SAMEORIGIN';
	const { domain, action, allowedDomains = [] } = opts;

	const directive = typeof action === 'string' ? action.toUpperCase() : DEFAULT_ACTION;
	const isAllowed = directive === ALLOW_KEY_WORD;
	const staticHeader = isAllowed ? `${ALLOW_KEY_WORD} ${domain}` : directive;
	const allowedDomainMap = {};

	allowedDomains.forEach(domain => {
		allowedDomainMap[domain] = `${ALLOW_KEY_WORD} ${domain}`;
	});

	app.addHook('onSend', (request, reply, payload, next) => {
		const header = isAllowed && allowedDomainMap[request.query.domain] || staticHeader;
		reply.header('X-Frame-Options', header);
		next();
	});

	next();
};

module.exports = fp(frameGuard, {
	fastify: '^1.0.0',
	name: 'fastify-frame-guard'
});
