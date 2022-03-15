import React, { useState, useEffect, useContext } from 'react';

import { useHistory, Link } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

import Wallet from '../../utils/blockchain/wallet';
import Loading from '../global/Loading';
import DataService from '../../services/db';
import { UserContext } from '../../contexts/UserContext';
import { AppContext } from '../../contexts/AppContext';

export default function Main() {
	const history = useHistory();
	const { sendPneumonicsToEmail, update: updateUser } = useContext(UserContext);
	const { setWallet } = useContext(AppContext);
	const [loadingMessage] = useState('Please wait, sending backup password to your email');
	const [loadingModal, setLoadingModal] = useState(false);
	const [agree, setAgree] = useState(true);
	const [agreeDonor, setAgreeDonor] = useState(false);
	const [profile, setProfile] = useState({ name: '', phone: '', address: '', email: '', gender: '', bloodGroup: '' });
	const termsAndConditionsUrl = 'https://hamrolifebank.com/privacy-policy';

	const walletCreate = async () => {
		try {
			setLoadingModal(true);
			const dbProfile = await DataService.get('profile');

			const res = await Wallet.create(dbProfile.phone);
			if (res) {
				const { wallet, encryptedWallet } = res;

				setWallet(wallet);
				await DataService.saveWallet(encryptedWallet);
				DataService.remove('temp_passcode');
				DataService.saveAddress(wallet.address);
				await sendPneumonicsToEmail({ pneumonics: wallet.mnemonic.phrase, email: dbProfile.email });
				const { name, phone, email, address, bloodGroup, gender, isDonor } = dbProfile;
				const userRes = await updateUser(dbProfile.userId, {
					name,
					phone,
					email,
					address,
					blood_group: bloodGroup,
					gender,
					is_donor: isDonor,
					wallet_address: wallet.address
				});

				history.push('/home');
			}
		} catch (err) {
			Swal.fire('ERROR', err.message, 'error');
		} finally {
			setLoadingModal(false);
		}
	};

	const save = async event => {
		event.preventDefault();
		const dbProfile = await DataService.get('profile');

		await DataService.save('profile', { ...dbProfile, ...profile });
		const pro = await DataService.get('profile');

		setLoadingModal(true);
		await walletCreate();
	};

	const updateProfile = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		data.serviceId = profile.serviceId || '';
		data.imageUrl = profile.imageUrl || '';
		formData.forEach((value, key) => (data[key] = value));
		data.phone = data.phone.replace(/[^0-9]/g, '');
		data.isDonor = agreeDonor;
		setProfile(data);
	};

	const handleAgreeTerms = e => {
		setAgreeDonor(e.target.checked);
		setProfile(prev => ({ ...prev, isDonor: e.target.checked }));
		setAgree(!e.target.checked);
	};

	useEffect(() => {
		(async () => {
			let profile = await DataService.get('profile');
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
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label disabled">Email Address</label>
										<Form.Control
											type="email"
											className="form-control"
											name="email"
											placeholder="Enter email"
											value={profile.email ? profile.email : ''}
											onChange={updateProfile}
											required
											readOnly
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" htmlFor="gender">
											Gender:
										</label>
										<select
											name="gender"
											className="form-control"
											required
											onChange={updateProfile}
											value={profile.gender ? profile.gender : ''}
										>
											<option value="">Select gender</option>
											<option value="M">Male</option>
											<option value="F">Female</option>
											<option value="O">Others</option>
										</select>
									</div>
								</div>
								<div className="form-group basic">
									<label className="label" htmlFor="bloodGroup">
										Blood Group:
									</label>
									<select
										name="bloodGroup"
										className="form-control"
										onChange={updateProfile}
										value={profile.bloodGroup ? profile.bloodGroup : ''}
									>
										<option value="">Select a blood group</option>
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
								<div className="form-group basic">
									<input
										type="checkbox"
										onChange={handleAgreeTerms}
										style={{ display: 'inline', marginRight: '7px' }}
									/>

									<label style={{ display: 'inline' }}>
										I agree to become a donor and I have read all the{' '}
										<Link
											onClick={() => {
												window.open(termsAndConditionsUrl, '_blank', 'noopener,noreferrer');
											}}
											target="_blank"
											to="#"
										>
											terms and conditions
										</Link>
										{' and '}
										<Link
											onClick={() => {
												window.open(termsAndConditionsUrl, '_blank', 'noopener,noreferrer');
											}}
											target="_blank"
											to="#"
										>
											privacy policies
										</Link>
									</label>
								</div>
							</div>
						</div>

						<div className="p-2">
							<Button disabled={agree} type="submit" className="btn btn-lg btn-block btn-success mt-3">
								Continue
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
}
