import React from 'react';
import AppHeader from '../layouts/AppHeader';
import { UserContextProvider } from '../../contexts/UserContext';
import DonationHistory from './donationHistory';

export default function Index() {
	return (
		<>
			<UserContextProvider>
				<AppHeader currentMenu="Donation History" />
				<DonationHistory />
			</UserContextProvider>
		</>
	);
}
