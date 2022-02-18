import React, { createContext } from 'react';
import UserService from '../services/user';

export const UserContext = createContext();
export const UserContextProvider = ({ children }) => {
	const emailLogin = payload => {
		return AuthService.login(payload);
	};

	const googleLogin = payload => {
		return AuthService.loginGoogle(payload);
	};

	const facebookLogin = payload => {
		return AuthService.loginFacebook(payload);
	};

	const getUserInfo = () => {
		return UserService.userInfo();
	};

	return (
		<UserContext.Provider
			value={{
				emailLogin,
				googleLogin,
				facebookLogin,
				getUserInfo
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
