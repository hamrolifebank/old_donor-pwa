import React, { useContext, useEffect, useState, useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import DataService from '../../services/db';
import ModalWrapper from '../global/ModalWrapper';

import { EventsContext } from '../../contexts/EventsContext';
import { AppContext } from '../../contexts/AppContext';

import authService from '../../services/auth';

export default function Events() {
	const { addToast } = useToasts();
	const { listEvents, pagination, events, registerUserToEvent } = useContext(EventsContext);
	const { wallet } = useContext(AppContext);
	const [user, setUser] = useState({});
	const [userDetailModal, setUserDetailModal] = useState(false);
	const [loginModal, setLoginModal] = useState(false);
	const [emailModal, setEmailModal] = useState(false);
	const [facebookModal, setFacebookModal] = useState(false);
	const [gmailModal, setGmailModal] = useState(false);
	const [loginPayload, setLoginPayload] = useState({});

	// const [userDetails, setUserDetails] = useState[''];
	// const [userName, setUserName] = useState[''];
	// const [userPhone, setUserPhone] = useState[''];
	// const [userEmail, setUserEmail] = useState[''];
	// const [userBloodGroup, setUserBloodGroup] = useState[''];
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

	const handleRegister = async eventId => {
		//await DataService.remove('user');
		//const userData = await DataService.get('user');
		const userToken = localStorage.getItem('access_token');
		if (userToken !== null) {
			userData.walletAddress = wallet.address;
			console.log(eventId, userData);
			registerUserToEvent(eventId, userData)
				.then(d => {
					Swal.fire('SUCCESS', 'Registration successful!', 'success');
				})
				.catch(e => {
					Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
				});
		} else {
			setLoginModal(true);
		}
	};

	const handleUserDetailsFormSubmit = async e => {
		e.preventDefault();
		// const obj = {
		// 	name: user.name,
		// 	number: user.number,
		// 	email: user.email,
		// 	bloodGroup: user.bloodGroup
		// };
		await DataService.save('user', user);
		// setUser(obj);
		setUserDetailModal(false);
	};

	const handleSignIn = option => {
		setLoginModal(false);
		if (option === 'email') {
			setEmailModal(true);
		} else if (option === 'gmail') {
		} else if (option === 'facebook') {
		}
	};

	const handleEmailSubmit = async e => {
		e.preventDefault();
		let payload = loginPayload;
		if (!payload.username.match(/\@/)) {
			payload.loginBy = 'phone';
		} else {
			payload.loginBy = 'email';
		}
		try {
			const response = await authService.login(payload);
			console.log(response);
		} catch (error) {
			let elem = document.getElementById('emailLoginFail');
			elem.style.display = 'block';
			console.log('error:', error);
		}
	};

	const handleGoBack = (e, from) => {
		e.preventDefault();
		if (from === 'email') {
			setLoginPayload({});
			setEmailModal(false);
			setLoginModal(true);
		}
	};

	useEffect(
		() => {
			fetchList();
		}, // eslint-disable-next-line
		[]
	);

	return (
		<>
			<div id="appCapsule">
				<Row
					style={{ padding: '0px 50px', marginLeft: '0px', marginRight: '0px' }}
					className="d-flex justify-content-center align-items-center"
				>
					{events && events.length > 0 ? (
						events.map((el, i) => {
							return (
								<Col md={6} className="d-flex justify-content-center" key={i}>
									<Card className="my-3 mx-1 text-center card-responsive">
										{/* <Row className="no-gutters">
										<Col> */}
										<Card.Header
											style={{
												backgroundColor: '#cf3d3c',
												borderRadius: '10px 10px 0px 0px'
											}}
										>
											<Card.Title style={{ fontSize: '20px', color: '#fff' }}>
												{el.name}
											</Card.Title>
											<Card.Subtitle style={{ color: '#f3f3f3' }}>
												{el.date ? moment(el.date).format('LL') : ''}
											</Card.Subtitle>
										</Card.Header>
										<Card.Body style={{ color: '#000' }}>
											<p>
												<b>Beneficiary : </b>
												{el.beneficiary.name}
											</p>
											<p>
												<b>Location : </b>
												{el.beneficiary.location || el.beneficiary.address || ''}
											</p>
											<p>
												<b>Contact : </b>
												{el.beneficiary.phone || ''}
											</p>
											<Button variant="primary" onClick={() => handleRegister(el._id)}>
												Register
											</Button>
										</Card.Body>
										{/* </Col>
									</Row> */}
									</Card>
								</Col>
							);
						})
					) : (
						<div id="appCapsule">There are no events currently...</div>
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
							<input
								name="name"
								type="text"
								className="form-control"
								ref={inputRef}
								required
								onChange={e => setUser(user => ({ ...user, name: e.target.value }))}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="number">Phone Number:</label>
							<input
								name="phone"
								type="text"
								className="form-control"
								required
								onChange={e => setUser(user => ({ ...user, phone: e.target.value }))}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">Email:</label>
							<input
								name="email"
								type="email"
								className="form-control"
								required
								onChange={e => setUser(user => ({ ...user, email: e.target.value }))}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="gender">Gender:</label>
							<select
								name="gender"
								className="form-control"
								required
								onChange={e => setUser(user => ({ ...user, gender: e.target.value }))}
								defaultValue=""
							>
								<option disabled value="">
									Select gender
								</option>
								<option value="M">Male</option>
								<option value="F">Female</option>
								<option value="O">Others</option>
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="bloodGroup">Blood Group:</label>
							<select
								name="bloodGroup"
								className="form-control"
								required
								onChange={e => setUser(user => ({ ...user, bloodGroup: e.target.value }))}
								defaultValue=""
							>
								<option disabled value="">
									Select a blood group
								</option>
								<option value="A+">A+</option>
								<option value="B+">B+</option>
								<option value="O+">O+</option>
								<option value="AB+">AB+</option>
								<option value="A-">A-</option>
								<option value="B-">B-</option>
								<option value="O-">O-</option>
								<option value="AB-">AB-</option>
							</select>
						</div>

						<button className="btn btn-primary" type="submit">
							Submit
						</button>
					</form>
				</ModalWrapper>
				<ModalWrapper showModal={loginModal} onShow={() => {}} onHide={() => setLoginModal(false)}>
					<div className="row d-flex justify-content-center align-items-center">
						<div className="col-md-12 text-center">
							<img src="/assets/img/icon/hlb-512.png" width="240" alt="Hamro LifeBank" />
						</div>
						<Col xs={12}>
							<div style={{ marginBottom: '30px', textAlign: 'center', color: '#d03d3d' }}>
								<span className="h4" style={{ marginBottom: '5px' }}>
									<strong>Vein-to-Vein</strong>
								</span>
								<div className="login-quote">
									<h3>
										Your Blood <br />
										Donation Journey
										<br />
										is Getting Smarter
									</h3>
								</div>
							</div>
						</Col>
						<Col xs={12}>
							<div className="connect mb-3 text-center">
								<span> Please choose login method </span>
							</div>
						</Col>
					</div>
					<Row>
						<Col xs={4} className="text-center">
							<button
								className="btn btn-circle btn-xl"
								style={{ backgroundColor: '#4267B2' }}
								onClick={() => handleSignIn('email')}
							>
								<i className="fa-brands fa-facebook-f" style={{ color: '#fff' }}></i>
							</button>
						</Col>
						<Col xs={4} className="text-center">
							<button
								className="btn btn-circle btn-xl"
								style={{ backgroundColor: '#DB4437' }}
								onClick={() => handleSignIn('email')}
							>
								<i className="fa-brands fa-google" style={{ color: '#fff' }}></i>
							</button>
						</Col>
						<Col xs={4} className="text-center">
							<button className="btn btn-success btn-circle btn-xl" onClick={() => handleSignIn('email')}>
								<i className="fa fa-envelope"> </i>
							</button>
						</Col>
					</Row>
				</ModalWrapper>
				<ModalWrapper showModal={emailModal} onShow={() => {}} onHide={() => setEmailModal(false)}>
					<div className="row d-flex justify-content-center align-items-center">
						<div className="col-md-12 text-center">
							<img src="/assets/img/icon/hlb-512.png" width="240" alt="Hamro LifeBank" />
						</div>
						<div className="col-md-12 ">
							<form id="emailForm" action="">
								<div className="form-group">
									<label htmlFor="email">Email:</label>
									<br />
									<input
										placeholder="Email/Phone"
										type="text"
										autoComplete="off"
										name="email"
										className="form-control"
										onChange={e => setLoginPayload(prev => ({ ...prev, username: e.target.value }))}
										required
									></input>
								</div>
								<div className="form-group">
									<label htmlFor="password">Password:</label> <br />
									<input
										placeholder="password"
										type="password"
										autoComplete="off"
										name="password"
										className="form-control"
										onChange={e => setLoginPayload(prev => ({ ...prev, password: e.target.value }))}
										required
									></input>
								</div>
								<div id="emailLoginFail" className="form-group" style={{ display: 'none' }}>
									<div className="alert alert-danger-custom">Invalid username or password</div>
								</div>
								<div className="form-group">
									<button
										type="submit"
										className="btn btn-success form-control"
										onClick={e => handleEmailSubmit(e)}
									>
										<i className="fa fa-lock"></i>&nbsp;&nbsp;Login
									</button>
								</div>
								<div className="form-group">
									<button
										className="btn btn-danger form-control"
										onClick={e => handleGoBack(e, 'email')}
									>
										<i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Go Back
									</button>
								</div>
							</form>
						</div>
					</div>
				</ModalWrapper>
			</div>
		</>
	);
}
