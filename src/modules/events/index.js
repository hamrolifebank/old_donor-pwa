import React from 'react';
import { CookiesProvider } from 'react-cookie';
import AppHeader from '../layouts/AppHeader';
import Events from './events';
import { EventsContextProvider } from '../../contexts/EventsContext';
import { UserContextProvider } from '../../contexts/UserContext';

export default function Index() {
	return (
		<>
			<CookiesProvider>
				<UserContextProvider>
					<EventsContextProvider>
						<AppHeader currentMenu="Events" />
						<Events />
					</EventsContextProvider>
				</UserContextProvider>
			</CookiesProvider>
		</>
	);
}
