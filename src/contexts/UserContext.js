import React, { createContext } from 'react';
import AuthService from '../services/auth';

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

	return (
		<UserContext.Provider
			value={{
				emailLogin,
				googleLogin,
				facebookLogin
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
