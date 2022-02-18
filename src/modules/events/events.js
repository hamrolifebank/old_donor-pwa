import React, { useContext, useEffect, useState, useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import moment from 'moment';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import DataService from '../../services/db';
import ModalWrapper from '../global/ModalWrapper';
import APPID from '../../constants/clientId';
import { EventsContext } from '../../contexts/EventsContext';
import { AppContext } from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import { getUserToken } from '../../utils/sessionmanager';

export default function Events() {
	const { addToast } = useToasts();
	const { listEvents, pagination, events, registerUserToEvent } = useContext(EventsContext);
	const { emailLogin, googleLogin, facebookLogin } = useContext(UserContext);
	const { wallet } = useContext(AppContext);
	const [user, setUser] = useState({});
	const [userDetailModal, setUserDetailModal] = useState(false);
	const [loginModal, setLoginModal] = useState(false);
	const [emailModal, setEmailModal] = useState(false);
	const [loginPayload, setLoginPayload] = useState({});

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

	const getAdditionalUserInfo = async () => {
		setUserDetailModal(true);
	};

	const handleRegisterToEvent = async eventId => {
		const userToken = getUserToken();

		if (userToken && userToken !== 'undefined' && userToken.length > 0) {
			let currentUser = await DataService.get('user');
			if (!currentUser.walletAddress) {
				await DataService.save('user', { ...currentUser, wallet_address: wallet.address });
			}
			const decodedToken = jwtDecode(userToken);
			if (!isTokenValid(decodedToken.exp)) {
				Swal.fire('ERROR', 'Your token has expired, please log in again', 'error').then(result => {
					setLoginModal(true);
				});

				return;
				//throw { data: { message: 'Token has expired' } };
			}
			if (
				!currentUser ||
				!currentUser.name ||
				!currentUser.email ||
				!currentUser.phone ||
				!currentUser.gender ||
				!currentUser.bloodGroup
			) {
				getAdditionalUserInfo()
					.then()
					.catch(e => {
						Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
					});
			}
			if (
				currentUser &&
				currentUser.name &&
				currentUser.email &&
				currentUser.phone &&
				currentUser.gender &&
				currentUser.bloodGroup
			) {
				registerUserToEvent(eventId, currentUser)
					.then(d => {
						Swal.fire('SUCCESS', 'Registration successful!', 'success');
					})
					.catch(e => {
						Swal.fire('ERROR', 'Registration failed, try again later!', 'error');
					});
			}
		} else {
			setLoginModal(true);
		}
	};

	const handleUserDetailsFormSubmit = async e => {
		e.preventDefault();
		let currentUser = await DataService.get('user');
		currentUser = { ...currentUser, ...user };
		await DataService.save('user', currentUser);
		setUserDetailModal(false);
	};

	const handleSignIn = option => {
		if (option === 'email') {
			setLoginModal(false);
			setEmailModal(true);
		}
	};

	const isTokenValid = tokenExp => {
		if (Date.now() >= tokenExp * 1000) return false;
		return true;
	};

	const toggleLoginFailAlert = display => {
		let elem = document.getElementById('emailLoginFail');
		if (display === true) elem.style.display = 'block';
		else elem.style.display = 'none';
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
			const response = await emailLogin(payload);
			if (response) {
				toggleLoginFailAlert(false);
				document.getElementById('emailForm').reset();
				setEmailModal(false);
				//window.location.replace('/');
				addToast('You have logged in succesfully', {
					appearance: 'success',
					autoDismiss: true
				});
			}
		} catch (error) {
			toggleLoginFailAlert(true);
			addToast(error.data.message, {
				appearance: 'error',
				autoDismiss: true
			});
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

	const responseGoogle = async response => {
		console.log('google response:', response);
		if (response.error === 'popup_closed_by_user') return;
		const { profileObj } = response;
		try {
			let { email } = profileObj;
			email = email.split('@')[1];
			if (['rumsan.com', 'rumsan.net'].includes(email)) {
				await googleLogin(profileObj);
				setLoginModal(false);
				addToast('You have logged in succesfully', {
					appearance: 'success',
					autoDismiss: true
				});
				//window.location.replace('/');
			} else throw new Error('User email must be from Rumsan Group of Companies');
		} catch (e) {
			Swal.fire('ERROR', e.message, 'error');
			addToast(erroMsg, {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};

	const responseFacebook = async response => {
		console.log('facebook response:', response);
		try {
			await facebookLogin(response);
			setLoginModal(false);
			addToast('You have logged in succesfully', {
				appearance: 'success',
				autoDismiss: true
			});
		} catch (e) {
			Swal.fire('ERROR', e, 'error');
		}
	};

	useEffect(
		() => {
			fetchList();
			const setInitialUserData = async () => {
				//await DataService.remove('user');
				const userData = await DataService.get('user');
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
											<Button variant="primary" onClick={() => handleRegisterToEvent(el._id)}>
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
					onHide={() => {
						setUserDetailModal(false);
						setUser({});
					}}
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
								value={user.name || ''}
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
								value={user.phone || ''}
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
								value={user.email || ''}
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
								value={user.gender ? user.gender : ''}
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
								value={user.bloodGroup ? user.bloodGroup : ''}
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
				<ModalWrapper showModal={loginModal} onHide={() => setLoginModal(false)}>
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
							<FacebookLogin
								render={renderProps => (
									<button
										className="btn btn-circle btn-xl"
										style={{ backgroundColor: '#4267B2' }}
										onClick={renderProps.onClick}
										disabled={renderProps.disabled}
									>
										<i className="fa-brands fa-facebook-f" style={{ color: '#fff' }}></i>
									</button>
								)}
								appId={APPID.facebookId}
								autoLoad={false}
								fields="name,email,picture"
								callback={responseFacebook}
							/>
						</Col>
						<Col xs={4} className="text-center">
							<GoogleLogin
								render={renderProps => (
									<button
										className="btn btn-circle btn-xl"
										style={{ backgroundColor: '#DB4437' }}
										onClick={renderProps.onClick}
										disabled={renderProps.disabled}
									>
										<i className="fa-brands fa-google" style={{ color: '#fff' }}></i>
									</button>
								)}
								className="btn"
								clientId={APPID.googleId}
								buttonText="Login with Google"
								onSuccess={responseGoogle}
								onFailure={responseGoogle}
								cookiePolicy={'single_host_origin'}
								isSignedIn={false}
								theme="dark"
							/>
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
