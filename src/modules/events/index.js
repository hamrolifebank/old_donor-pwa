import React from 'react';
import { CookiesProvider } from 'react-cookie';
import AppHeader from '../layouts/AppHeader';
import Events from './events';
import { EventsContextProvider } from '../../contexts/EventsContext';

export default function Index() {
	return (
		<>
			<CookiesProvider>
				<EventsContextProvider>
					<AppHeader currentMenu="Events" />
					<Events />
				</EventsContextProvider>
			</CookiesProvider>
		</>
	);
}
