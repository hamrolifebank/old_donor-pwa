import React from 'react';
import AppHeader from '../layouts/AppHeader';
import Profile from './profile';
import { UserContextProvider } from '../../contexts/UserContext';

export default function Index() {
	return (
		<>
			<UserContextProvider>
				<AppHeader currentMenu="Settings" />
				<Profile />
			</UserContextProvider>
		</>
	);
}
