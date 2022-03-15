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

	const getUserDonations = () => {
		return UserService.getUserDonations();
	};

	const getUserInfo = () => {
		return UserService.getUserInfo();
	};

	const logOut = async () => {
		await DataService.remove('user');
		logoutUser();
	};

	const generateOTP = payload => {
		return UserService.generateOTP(payload);
	};

	const verifyOTP = payload => {
		return UserService.verifyOTP(payload);
	};

	const sendPneumonicsToEmail = payload => {
		return UserService.sendPneumonicsToEmail(payload);
	};

	const update = (id, payload) => {
		return UserService.update(id, payload);
	};

	return (
		<UserContext.Provider
			value={{
				emailLogin,
				googleLogin,
				facebookLogin,
				logOut,
				generateOTP,
				verifyOTP,
				sendPneumonicsToEmail,
				update,
				getUserDonations,
				getUserInfo
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
