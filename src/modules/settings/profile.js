import React, { useContext, useEffect, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { Form } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import Swal from 'sweetalert2';
import { useToasts } from 'react-toast-notifications';
import DataService from '../../services/db';

let profile;
let dbInfo;

export default function Profile() {
	const { addToast } = useToasts();
	const [userPic, setUserPic] = useState('/assets/img/icon/hlb-512.png');
	const [userInfo, setUserInfo] = useState({});
	const [disableInput, setDisableInput] = useState(true);
	const { getUserInfo, update } = useContext(UserContext);

	const fetchInfo = async () => {
		try {
			profile = await DataService.get('profile');
			if (profile.imageUrl) setUserPic(profile.imageUrl);

			dbInfo = await getUserInfo();
			const obj = {
				name: dbInfo.name,
				phone: dbInfo.phone,
				email: dbInfo.email,
				address: dbInfo.address,
				gender: dbInfo.gender
			};
			setUserInfo(obj);
			if (dbInfo.blood_info.group && dbInfo.blood_info.rh_factor) {
				setUserInfo(prev => ({
					...prev,
					blood_group: `${dbInfo.blood_info.group}${dbInfo.blood_info.rh_factor}`
				}));
			}
		} catch (error) {
			addToast('Something went wrong', {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};

	const handleCancel = e => {
		e.preventDefault();
		setDisableInput(true);
		fetchInfo();
	};

	const handleEdit = e => {
		e.preventDefault();
		setDisableInput(false);
	};

	const handleSave = e => {
		e.preventDefault();
		setDisableInput(true);
		update(dbInfo.user_id, userInfo)
			.then(async d => {
				await fetchInfo();
				addToast('Update Successful', {
					appearance: 'success',
					autoDismiss: true
				});
			})
			.catch(e =>
				addToast('Something went wrong', {
					appearance: 'error',
					autoDismiss: true
				})
			);
	};

	const updateUserInfo = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => (data[key] = value));
		data.phone = data.phone.replace(/[^0-9]/g, '');
		setUserInfo(data);
	};

	useEffect(
		() => {
			async function run() {
				await fetchInfo();
			}
			run();
		}, // eslint-disable-next-line
		[]
	);

	return (
		<>
			<div id="appCapsule">
				<div className="section mt-2">
					<div className="profile-head d-flex justify-content-center">
						<div className="avatar">
							<img src={userPic} alt="avatar" className="imaged w64 rounded" />
						</div>
					</div>
				</div>
				<Form onSubmit={handleSave}>
					<div className="section full my-3">
						<div className="container">
							<div align="right">
								<button
									className="btn btn-warning mb-2"
									onClick={handleEdit}
									style={{ display: disableInput ? 'block' : 'none' }}
								>
									Edit
								</button>
								<button
									className="btn btn-secondary mb-2 mr-2"
									onClick={handleCancel}
									style={{ display: disableInput ? 'none' : 'inline' }}
								>
									Cancel
								</button>
								<button
									className="btn btn-success mb-2"
									onClick={handleSave}
									style={{ display: disableInput ? 'none' : 'inline' }}
									type="submit"
								>
									Save
								</button>
							</div>
							<div className="card ">
								<div className="card-body">
									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label">Full Name</label>
											<Form.Control
												type="text"
												name="name"
												className="form-control"
												placeholder="Enter your full name"
												value={userInfo.name ? userInfo.name : ''}
												onChange={updateUserInfo}
												disabled={disableInput}
												required
											/>
											<i className="clear-input">
												<IoCloseCircle className="ion-icon" />
											</i>
										</div>
									</div>
									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label">Phone Number</label>
											<Form.Control
												type="text"
												name="phone"
												className="form-control"
												placeholder="Enter your phone number"
												value={userInfo.phone ? userInfo.phone : ''}
												onChange={updateUserInfo}
												disabled={disableInput}
												required
											/>
											<i className="clear-input">
												<IoCloseCircle className="ion-icon" />
											</i>
										</div>
									</div>
									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label">Email</label>
											<Form.Control
												type="text"
												name="email"
												className="form-control"
												placeholder="Enter your email address"
												value={userInfo.email ? userInfo.email : ''}
												onChange={updateUserInfo}
												readOnly
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
												name="address"
												className="form-control"
												placeholder="Enter your address"
												value={userInfo.address ? userInfo.address : ''}
												onChange={updateUserInfo}
												disabled={disableInput}
												required
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
												onChange={updateUserInfo}
												value={userInfo.gender ? userInfo.gender : ''}
												disabled={disableInput}
											>
												<option value="">Select gender</option>
												<option value="M">Male</option>
												<option value="F">Female</option>
												<option value="O">Others</option>
											</select>
										</div>
									</div>
									<div className="form-group basic">
										<label className="label" htmlFor="blood_group">
											Blood Group:
										</label>
										<select
											name="blood_group"
											className="form-control"
											onChange={updateUserInfo}
											value={userInfo.blood_group ? userInfo.blood_group : ''}
											disabled={disableInput}
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
								</div>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</>
	);
}
