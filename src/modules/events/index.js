import React from 'react';
import AppHeader from '../layouts/AppHeader';
import Events from './events';
import { EventsContextProvider } from '../../contexts/EventsContext';

export default function Index() {
	const fetchList = query => {};
	return (
		<>
			<EventsContextProvider>
				<AppHeader currentMenu="Events" />
				<Events />
			</EventsContextProvider>
		</>
	);
}
