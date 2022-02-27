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
import { UserContext } from '../../contexts/UserContext';
import { getUserToken } from '../../utils/sessionmanager';

export default function Events() {
	const { addToast } = useToasts();
	const { listEvents, pagination, events, registerUserToEvent } = useContext(EventsContext);
	const { wallet } = useContext(AppContext);
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
					registerUserToEvent(eventId, user)
						.then(d => {
							Swal.fire('SUCCESS', 'Registration successful!', 'success');
						})
						.catch(e => {
							Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
						});
				}
			}
		}
		// if (userToken && userToken !== 'undefined' && userToken.length > 0) {
		// 	let currentUser = await DataService.get('user');
		// 	if (!currentUser.walletAddress) {
		// 		await DataService.save('usepror', { ...currentUser, wallet_address: wallet.address });
		// 	}
		// 	const decodedToken = jwtDecode(userToken);
		// 	if (!isTokenValid(decodedToken.exp)) {
		// 		Swal.fire('ERROR', 'Your token has expired, please log in again', 'error').then(result => {
		// 			setLoginModal(true);
		// 		});

		// 		return;
		// 		//throw { data: { message: 'Token has expired' } };
		// 	}
		// 	if (
		// 		!currentUser ||
		// 		!currentUser.name ||
		// 		!currentUser.email ||
		// 		!currentUser.phone ||
		// 		!currentUser.gender ||
		// 		!currentUser.bloodGroup
		// 	) {
		// 		getAdditionalUserInfo()
		// 			.then()
		// 			.catch(e => {
		// 				Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
		// 			});
		// 	}
		// 	if (
		// 		currentUser &&
		// 		currentUser.name &&
		// 		currentUser.email &&
		// 		currentUser.phone &&
		// 		currentUser.gender &&
		// 		currentUser.bloodGroup
		// 	) {
		// 		registerUserToEvent(eventId, currentUser)
		// 			.then(d => {
		// 				Swal.fire('SUCCESS', 'Registration successful!', 'success');
		// 			})
		// 			.catch(e => {
		// 				Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
		// 			});
		// 	}
		// } else {
		// 	setLoginModal(true);
		// }
	};

	useEffect(
		() => {
			fetchList();
			console.log(events);
			const setInitialUserData = async () => {
				//await DataService.remove('user');
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
				<div class="container mt-4">
					<div class="row">
						{events && events.length > 0 ? (
							events.map((el, i) => {
								return (
									<div class="col-lg-4" key={i}>
										<div class="card card-margin">
											<div class="card-header no-border">
												<h5 class="card-title">{moment(el.date).format('dddd')}</h5>
											</div>
											<div class="card-body pt-0">
												<div class="widget-49">
													<div class="widget-49-title-wrapper">
														<div class="widget-49-date-primary">
															<span class="widget-49-date-day">
																{moment(el.date).format('D')}
															</span>
															<span class="widget-49-date-month">
																{moment(el.date).format('MMM')}
															</span>
														</div>
														<div class="widget-49-meeting-info">
															<span class="widget-49-pro-title">
																{el.name ? el.name : ''}
															</span>
															<span class="widget-49-meeting-time">
																{moment(el.date).format('hh:mm a')}
															</span>
														</div>
													</div>
													<ul class="widget-49-meeting-points">
														<li class="widget-49-meeting-item">
															<span>
																<b>
																	<i className="fa-solid fa-location-dot"></i>
																</b>{' '}
																{el.location
																	? el.location
																	: el.beneficiary.address
																	? el.beneficiary.address
																	: ''}
															</span>
														</li>
														<li class="widget-49-meeting-item">
															<span>
																<b>
																	<i class="fa-solid fa-house-chimney-medical"></i>
																</b>{' '}
																{el.beneficiary.name ? el.beneficiary.name : ''}
															</span>
														</li>
													</ul>
													<div class="widget-49-meeting-action">
														<Link
															to={`/events/${el._id}`}
															className="btn btn-sm btn-flash-border-primary"
														>
															Details
														</Link>
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
