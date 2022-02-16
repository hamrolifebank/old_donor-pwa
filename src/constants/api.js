const server_url = 'http://localhost:3011';
const base_url = `${server_url}/api/v1`;

module.exports = {
	SERVER_URL: server_url,
	BASE_URL: base_url,
	EVENTS: `${base_url}/events`,
	USERS: `${base_url}/users`
};
