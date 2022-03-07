import API from '../constants/api';
import axios from 'axios';
import { saveUser, saveUserToken, saveUserRoles, getUserToken } from '../utils/sessionmanager';
import DataService from './db';

const User = {
	login(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.SERVER_URL}/login_process`, payload)
				.then(async res => {
					saveUser(res.data.user);
					saveUserToken(res.data.user.token);
					saveUserRoles(res.data.user.roles);
					await DataService.save('user', { userId: res.data.user.id });
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	loginGoogle(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.NEW_BASE_URL}/auth/google-login`, payload)
				.then(async res => {
					console.log('google login response', res);
					saveUser(res.data.user);
					saveUserToken(res.data.access_token);
					saveUserRoles(res.data.user.roles);
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	loginFacebook(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.BASE_URL}/users/auth/facebookLogin`, payload)
				.then(async res => {
					saveUser(res.data.user);
					saveUserToken(res.data.token);
					saveUserRoles(res.data.user.roles);
					await DataService.save('user', { userId: res.data.user.id });
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	getUserDonations() {
		const userToken = getUserToken();
		return new Promise((resolve, reject) => {
			axios
				.get(`${API.NEW_BASE_URL}/users/me-history`, {
					headers: {
						access_token: userToken
					}
				})
				.then(res => {
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	getUserInfo() {
		const userToken = getUserToken();
		return new Promise((resolve, reject) => {
			axios
				.get(`${API.NEW_BASE_URL}/users/me`, {
					headers: {
						access_token: userToken
					}
				})
				.then(res => {
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	generateOTP(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.NEW_BASE_URL}/auth/otp-generate`, payload)
				.then(res => {
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	verifyOTP(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.NEW_BASE_URL}/auth/otp-verify`, payload)
				.then(res => {
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	sendPneumonicsToEmail(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.NEW_BASE_URL}/auth/pneumonics-email`, payload)
				.then(res => {
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	update(id, payload) {
		const userToken = getUserToken();
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.NEW_BASE_URL}/users/${id}`, payload, {
					headers: {
						access_token: userToken
					}
				})
				.then(res => {
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	}
};

export default User;
