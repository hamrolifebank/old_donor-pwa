import React, { createContext, useReducer } from 'react';
import eventsReduce from '../reducers/eventsReducer';
import * as Service from '../services/events';
import ACTION from '../actions/events';

const initialState = {
	events: [],
	pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
	eventDetails: null,
	loading: false
};

export const EventsContext = createContext(initialState);
export const EventsContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(eventsReduce, initialState);

	const listEvents = query => {
		return new Promise((resolve, reject) => {
			Service.get(query)
				.then(res => {
					dispatch({ type: ACTION.LIST_SUCCESS, res });
					resolve(res);
				})
				.catch(e => reject(e));
		});
	};

	const registerUserToEvent = payload => {
		return new Promise((resolve, reject) => {
			Service.registerUserToEvent(payload)
				.then(res => resolve(res))
				.catch(e => reject(e));
		});
	};

	const unregisterUserFromEvent = payload => {
		return new Promise((resolve, reject) => {
			Service.unregisterUserFromEvent(payload)
				.then(res => resolve(res))
				.catch(e => reject(e));
		});
	};

	return (
		<EventsContext.Provider
			value={{
				events: state.events,
				loading: state.loading,
				pagination: state.pagination,
				eventDetails: state.eventDetails,
				listEvents,
				registerUserToEvent,
				unregisterUserFromEvent
			}}
		>
			{children}
		</EventsContext.Provider>
	);
};
