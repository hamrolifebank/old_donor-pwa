import React, { useContext, useEffect, useState, useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import DataService from '../../services/db';
import ModalWrapper from '../global/ModalWrapper';

import { EventsContext } from '../../contexts/EventsContext';
import { AppContext } from '../../contexts/AppContext';

export default function Events() {
	const { addToast } = useToasts();
	const { listEvents, pagination, events } = useContext(EventsContext);
	const { wallet } = useContext(AppContext);
	const [user, setUser] = useState({});
	const [userDetailModal, setUserDetailModal] = useState(false);
	const inputRef = useRef(null);

	const fetchList = query => {
		let params = { ...pagination, ...query };

		listEvents(params)
			.then()
			.catch(e => {
				addToast('Something went wrong', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const handleRegister = async () => {
		console.log('wallet:', wallet);
		const userData = await DataService.get('user');
		console.log(userData);
		if (userData !== null) setUser(userData);
		else {
			setUserDetailModal(true);
		}
	};

	const handleUserDetailsFormSubmit = async e => {
		e.preventDefault();
		const data = new FormData(e.target);
		const obj = {
			name: data.get('name'),
			number: data.get('number'),
			email: data.get('email'),
			bloodGroup: data.get('bloodGroup')
		};
		await DataService.save('user', obj);
		setUser(obj);
	};

	useEffect(
		() => {
			fetchList();
		}, // eslint-disable-next-line
		[]
	);

	// useEffect(
	// 	() => {
	// 		console.log('events:', events);
	// 	}, // eslint-disable-next-line
	// 	[events]
	// );

	return (
		<>
			<Row style={{ padding: '56px 50px' }} className="d-flex justify-content-center align-items-center">
				{events && events.length > 0 ? (
					events.map((el, i) => {
						return (
							<Col md={6} className="d-flex justify-content-center" key={i}>
								<Card style={{ width: '60%' }} className="my-3 mx-1 text-center">
									<Row className="no-gutters">
										<Col>
											<Card.Body>
												<Card.Title style={{ fontSize: '20px' }}>{el.name}</Card.Title>
												<Card.Subtitle className="mb-2 text-muted">
													{el.date ? moment(el.date).format('LL') : ''}
												</Card.Subtitle>
												<Card.Title>Beneficiary: {el.beneficiary.name}</Card.Title>
												<Button variant="primary" onClick={handleRegister}>
													Register
												</Button>
											</Card.Body>
										</Col>
									</Row>
								</Card>
							</Col>
						);
					})
				) : (
					<div>There are no events currently...</div>
				)}
			</Row>
			<ModalWrapper
				title="Enter your Details"
				showModal={userDetailModal}
				onShow={() => inputRef.current.focus()}
				onHide={() => setUserDetailModal(false)}
			>
				<form id="userDetailsForm" onSubmit={handleUserDetailsFormSubmit}>
					<div className="form-group">
						<label htmlFor="name">Name:</label>
						<input name="name" type="text" className="form-control" ref={inputRef} required />
					</div>
					<div className="form-group">
						<label htmlFor="number">Phone Number:</label>
						<input name="number" type="text" className="form-control" required />
					</div>
					<div className="form-group">
						<label htmlFor="email">Email:</label>
						<input name="email" type="email" className="form-control" required />
					</div>
					<div className="form-group">
						<label htmlFor="bloodGroup">Blood Group:</label>
						<input name="bloodGroup" type="text" className="form-control" required />
					</div>
					<button className="btn btn-primary" type="submit">
						Submit
					</button>
				</form>
			</ModalWrapper>
		</>
	);
}
