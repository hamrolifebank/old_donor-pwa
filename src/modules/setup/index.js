import React, { useState, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import DataService from '../../services/db';
import { IoLogoGoogle } from 'react-icons/io5';
import { GoogleLogin } from 'react-google-login';
import Swal from 'sweetalert2';

import APP_ID from '../../constants/clientId';

export default function Setup() {
	let history = useHistory();

	const responseGoogle = async response => {
		console.log('google response:', response);
		if (response.error === 'popup_closed_by_user') return;
		const { profileObj } = response;
		try {
			if (!profileObj) return;
			let { name, email, googleId, imageUrl } = profileObj;
			let emailSuffix = email.split('@')[1];
			if (['rumsan.com', 'rumsan.net'].includes(emailSuffix)) {
				console.log('profileObj:', profileObj);
				await DataService.save('profile', { name, email, serviceId: googleId, imageUrl });
				history.push('/setup/profile');
			} else throw new Error('User email must be from Rumsan Group of Companies');
		} catch (e) {
			console.log(e);
			Swal.fire('ERROR', e.message, 'error');
		}
	};

	return (
		<div id="appCapsule" className="h-100">
			<div className="d-flex justify-content-center align-items-center">
				<div className="col-md-12 text-center">
					<img src="/assets/img/icon/hlb-512.png" width="240" alt="Hamro LifeBank" />
				</div>
			</div>
			<div className="section pt-1">
				<div className="card" style={{ height: 380, paddingTop: 50, paddingLeft: 5, paddingRight: 5 }}>
					<div className="balance">
						<div className="">
							<div style={{ paddingLeft: 20, paddingRight: 20 }}>
								<h2 className="value">Let's setup your wallet</h2>
								<span className="title">Please choose one of the options to setup your wallet.</span>
							</div>
							<div className="card-body">
								<GoogleLogin
									render={renderProps => (
										<button
											id="btnSetupWallet"
											type="button"
											className="btn btn-lg btn-block btn-google"
											onClick={renderProps.onClick}
											disabled={renderProps.disabled}
										>
											<IoLogoGoogle className="ion-icon" aria-label="Login Using Google" />
											Login Using Google
										</button>
									)}
									className="btn"
									clientId={APP_ID.googleId}
									buttonText="Login with Google"
									onSuccess={responseGoogle}
									onFailure={responseGoogle}
									cookiePolicy={'single_host_origin'}
									isSignedIn={false}
									theme="dark"
								/>

								<div className="mt-2"></div>

								<button
									onClick={() => setAction('restore_gdrive')}
									id="btnSetupWallet"
									type="button"
									className="btn btn-lg btn-block btn-email mb-2"
								>
									<IoLogoGoogle className="ion-icon" aria-label="Restore Using Google" />
									Login Using Email
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
