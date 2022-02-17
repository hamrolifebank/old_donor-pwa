import API from '../constants/api';
import axios from 'axios';
import { saveUser, saveUserToken, saveUserRoles } from '../utils/sessionmanager';

const Auth = {
	login(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.SERVER_URL}/login_process`, payload)
				.then(res => {
					saveUser(res.data.user);
					saveUserToken(res.data.user.token);
					saveUserRoles(res.data.user.roles);
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	},

	loginGoogle(payload) {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API.BASE_URL}/users/auth/googleLogin`, payload)
				.then(res => {
					saveUser(res.data.user);
					saveUserToken(res.data.token);
					saveUserRoles(res.data.user.roles);
					resolve(res.data);
				})
				.catch(e => reject(e.response));
		});
	}
};

export default Auth;
