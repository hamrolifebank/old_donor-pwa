import React, { createContext } from 'react';
import UserService from '../services/user';
import DataService from '../services/db';
import { logoutUser } from '../utils/sessionmanager';

export const UserContext = createContext();
export const UserContextProvider = ({ children }) => {
	const emailLogin = payload => {
		return UserService.login(payload);
	};

	const googleLogin = payload => {
		return UserService.loginGoogle(payload);
	};

	const facebookLogin = payload => {
		return UserService.loginFacebook(payload);
	};

	const getUserInfo = () => {
		return UserService.userInfo();
	};

	const logOut = async () => {
		DataService.remove('user');
		logoutUser();
	};

	return (
		<UserContext.Provider
			value={{
				emailLogin,
				googleLogin,
				facebookLogin,
				getUserInfo,
				logOut
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
