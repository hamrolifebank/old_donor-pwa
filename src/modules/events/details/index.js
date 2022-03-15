import React from 'react';
import AppHeader from '../../layouts/AppHeader';
import EventDetail from './eventDetail';
import { EventsContextProvider } from '../../../contexts/EventsContext';
import { UserContextProvider } from '../../../contexts/UserContext';

export default function Index(props) {
	return (
		<>
			<UserContextProvider>
				<EventsContextProvider>
					<AppHeader currentMenu="Event Detail" />
					<EventDetail params={props.match.params} />
				</EventsContextProvider>
			</UserContextProvider>
		</>
	);
}
