import API from '../constants/api';
import axios from 'axios';
import { saveUser, saveUserToken, saveUserRoles, getUserToken } from '../utils/sessionmanager';
import DataService from './db';

const userToken = getUserToken();

const User = {
	login(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.SERVER_URL}/login_process`, payload)
				.then(async res => {
					saveUser(res.data.user);
					saveUserToken(res.data.user.token);
					saveUserRoles(res.data.user.roles);
					await DataService.save('user', { user_id: res.data.user.id });
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	loginGoogle(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.BASE_URL}/users/auth/googleLogin`, payload)
				.then(async res => {
					saveUser(res.data.user);
					saveUserToken(res.data.token);
					saveUserRoles(res.data.user.roles);
					await DataService.save('user', { user_id: res.data.user.id });
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
					await DataService.save('user', { user_id: res.data.user.id });
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	userInfo() {
		return new Promise((resolve, reject) => {
			axios
				.get(`${API.BASE_URL}/users/me`, {
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