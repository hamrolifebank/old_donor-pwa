import React from 'react';
import AppHeader from '../layouts/AppHeader';
import Events from './events';
import { EventsContextProvider } from '../../contexts/EventsContext';
import { UserContextProvider } from '../../contexts/UserContext';

export default function Index() {
	return (
		<>
			<UserContextProvider>
				<EventsContextProvider>
					<AppHeader currentMenu="Events" />
					<Events />
				</EventsContextProvider>
			</UserContextProvider>
		</>
	);
}
