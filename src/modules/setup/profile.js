import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

import Loading from '../global/Loading';
import OTP from '../../constants/otp';
import DataService from '../../services/db';
import { UserContext } from '../../contexts/UserContext';

export default function Main() {
	const history = useHistory();
	const { generateOTP } = useContext(UserContext);
	const [loadingMessage] = useState('Please wait, sending OTP verification code to your email');
	const [loadingModal, setLoadingModal] = useState(false);
	const [profile, setProfile] = useState({ name: '', phone: '', address: '', email: '', gender: '', bloodGroup: '' });

	const save = async event => {
		event.preventDefault();
		console.log('input profile:', profile);
		await DataService.save('profile', profile);
		const pro = await DataService.get('profile');
		console.log('db profile:', pro);
		setLoadingModal(true);
		generateOTP({ email: profile.email, otpLength: OTP.LENGTH, otpValidTime: OTP.VALID_TIME })
			.then(d => {
				setLoadingModal(false);
				console.log('response from generate otp:', d);
				history.push({ pathname: '/otp-verify', state: { otpDetails: d, email: profile.email } });
			})
			.catch(e => {
				setLoadingModal(false);
				Swal.fire('ERROR', 'Something Went Wrong!', 'error');
			});
	};

	const updateProfile = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		data.googleId = profile.googleId || '';
		data.imageUrl = profile.imageUrl || '';
		formData.forEach((value, key) => (data[key] = value));
		data.phone = data.phone.replace(/[^0-9]/g, '');
		console.log(data);
		setProfile(data);
	};

	useEffect(() => {
		(async () => {
			let profile = await DataService.get('profile');
			console.log('initial data in db-profile:', profile);
			if (profile) setProfile(profile);
		})();
	}, []);

	return (
		<>
			<Loading message={loadingMessage} showModal={loadingModal} />
			<div id="appCapsule">
				<div className="d-flex justify-content-center align-items-center">
					<div className="col-md-12 text-center">
						<img src="/assets/img/icon/hlb-512.png" width="240" alt="Hamro LifeBank" />
					</div>
				</div>
				<div className="section pt-1">
					<Form onSubmit={save}>
						<div className="card">
							<div className="card-body">
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Full Name</label>
										<Form.Control
											type="text"
											name="name"
											className="form-control"
											placeholder="Enter your full name"
											value={profile.name ? profile.name : ''}
											onChange={updateProfile}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Phone</label>
										<Form.Control
											type="number"
											className="form-control"
											name="phone"
											placeholder="Enter mobile number"
											value={profile.phone ? profile.phone : ''}
											onChange={updateProfile}
											onKeyDown={e => {
												if (['-', '+', 'e'].includes(e.key)) {
													e.preventDefault();
												}
											}}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Address</label>
										<Form.Control
											type="text"
											className="form-control"
											name="address"
											placeholder="Enter your address"
											value={profile.address ? profile.address : ''}
											onChange={updateProfile}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Email Address</label>
										<Form.Control
											type="email"
											className="form-control"
											name="email"
											placeholder="Enter email"
											value={profile.email ? profile.email : ''}
											onChange={updateProfile}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label htmlFor="gender">Gender:</label>
										<select
											name="gender"
											className="form-control"
											required
											onChange={updateProfile}
											value={profile.gender ? profile.gender : ''}
										>
											<option disabled value="">
												Select gender
											</option>
											<option value="M">Male</option>
											<option value="F">Female</option>
											<option value="O">Others</option>
										</select>
									</div>
								</div>
								<div className="form-group basic">
									<label htmlFor="bloodGroup">Blood Group:</label>
									<select
										name="bloodGroup"
										className="form-control"
										onChange={updateProfile}
										value={profile.bloodGroup ? profile.bloodGroup : ''}
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
							</div>
						</div>

						<div className="p-2">
							<Button type="submit" className="btn btn-lg btn-block btn-success mt-3">
								Continue
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
}
