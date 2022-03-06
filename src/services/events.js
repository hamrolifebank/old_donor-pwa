import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';
import { getAuthHeaders } from '../utils';
import { getUserToken } from '../utils/sessionmanager';

axios.defaults.headers.common['access_token'] = getUserToken();

export function get(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.NEW_BASE_URL}/events?${qs.stringify(query)}`)
			.then(res => resolve(res.data))
			.catch(e => {
				reject(e.response);
			});
	});
}

export function registerUserToEvent(data) {
	const { auth_signature, data_signature, eventId, user } = data;
	const config = getAuthHeaders(auth_signature, data_signature);
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.NEW_BASE_URL}/events/${eventId}/register`, user, config)
			.then(res => resolve(res))
			.catch(e => {
				reject(e.response);
			});
	});
}

export function unregisterUserFromEvent(data) {
	const { auth_signature, data_signature, eventId, userId } = data;
	console.log('userId', userId);
	const config = getAuthHeaders(auth_signature, data_signature);
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.NEW_BASE_URL}/events/${eventId}/unregister`, { userId }, config)
			.then(res => resolve(res))
			.catch(e => {
				reject(e.response);
			});
	});
}
