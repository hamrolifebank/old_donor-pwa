import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Card, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import DataService from '../../services/db';
import { EventsContext } from '../../contexts/EventsContext';
import { AppContext } from '../../contexts/AppContext';
import { getUserToken } from '../../utils/sessionmanager';

export default function Events() {
	const { addToast } = useToasts();
	const { listEvents, pagination, events, registerUserToEvent } = useContext(EventsContext);
	const { signAndCallService } = useContext(AppContext);
	const [user, setUser] = useState({});

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

	const isTokenValid = tokenExp => {
		if (Date.now() >= tokenExp * 1000) return false;
		return true;
	};

	const handleRegisterToEvent = async eventId => {
		const userToken = getUserToken();
		const decodedToken = jwtDecode(userToken);

		if (userToken && userToken !== 'undefined' && userToken.length > 0) {
			console.log('user:', user);
			if (!isTokenValid(decodedToken.exp)) {
				Swal.fire('ERROR', 'Your token has expired, please log in again', 'error').then(result => {});
				return;
			} else {
				if (user && user.name && user.email && user.phone && user.gender && user.bloodGroup) {
					signAndCallService(registerUserToEvent, { eventId, user })
						.then(d => {
							Swal.fire('SUCCESS', 'Registration successful!', 'success');
							console.log(d);
						})
						.catch(e => {
							console.log(e.data.message);
							console.log(e.data.message === 'Event has expired');
							if (e.data.message === 'Event has expired') Swal.fire('ERROR', e.data.message, 'error');
							else if (e.data.message === 'Event does not exist')
								Swal.fire('ERROR', e.data.message, 'error');
							else if (e.data.message === 'User has already registered to the event')
								Swal.fire('ERROR', e.data.message, 'error');
							else Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
						});
				}
			}
		}
	};

	useEffect(
		() => {
			fetchList();
			console.log(events);
			const setInitialUserData = async () => {
				const userData = await DataService.get('profile');
				if (userData) {
					setUser(userData);
				}
			};
			setInitialUserData();
		}, // eslint-disable-next-line
		[]
	);

	return (
		<>
			<div id="appCapsule">
				<div className="container mt-4">
					<div className="row">
						{events && events.length > 0 ? (
							events.map((el, i) => {
								return (
									<div className="col-lg-4" key={i}>
										<div className="card card-margin">
											<div className="card-header no-border">
												<h5 className="card-title">{moment(el.date).format('dddd')}</h5>
											</div>
											<div className="card-body pt-0">
												<div className="widget-49">
													<div className="widget-49-title-wrapper">
														<div className="widget-49-date-primary">
															<span className="widget-49-date-day">
																{moment(el.date).format('D')}
															</span>
															<span className="widget-49-date-month">
																{moment(el.date).format('MMM')}
															</span>
														</div>
														<div className="widget-49-meeting-info">
															<span className="widget-49-pro-title">
																{el.name ? el.name : ''}
															</span>
															<span className="widget-49-meeting-time">
																{moment(el.date).format('hh:mm a')}
															</span>
														</div>
													</div>
													<ul className="widget-49-meeting-points">
														<li className="widget-49-meeting-item">
															<span>
																<b>
																	<i className="fa-solid fa-location-dot mr-2"></i>
																</b>
																{el.location
																	? el.location
																	: el.beneficiary.address
																	? el.beneficiary.address
																	: ''}
															</span>
														</li>
														<li className="widget-49-meeting-item">
															<span>
																<b>
																	<i className="fa-solid fa-house-chimney-medical"></i>
																</b>{' '}
																{el.beneficiary.name ? el.beneficiary.name : ''}
															</span>
														</li>
													</ul>
													<div className="widget-49-meeting-action">
														<Link
															to="#"
															onClick={() => handleRegisterToEvent(el._id)}
															className="btn btn-sm btn-flash-border-primary"
														>
															Register
														</Link>
														{/* <Link
															to={`/events/${el._id}`}
															className="btn btn-sm btn-flash-border-primary"
														>
															Details
														</Link> */}
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div>There are no events currently...</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
