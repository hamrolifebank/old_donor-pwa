const server_url = 'http://localhost:3011';
const base_url = `${server_url}/api/v1`;

module.exports = {
	NEW_BASE_URL: 'http://localhost:3601/api/v1',
	SERVER_URL: server_url,
	BASE_URL: base_url,
	EVENTS: `${base_url}/events`,
	USERS: `${base_url}/users`
};
