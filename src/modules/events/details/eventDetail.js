import React from 'react';

export default function Events(props) {
	const eventId = props.params.id;
	console.log(eventId);
	return (
		<>
			<div id="appCapsule">
				<div className="container mt-4">Event ID => {eventId}</div>
			</div>
		</>
	);
}
