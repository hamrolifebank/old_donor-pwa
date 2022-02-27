import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../global/Loading';

import DataService from '../../services/db';
import Wallet from '../../utils/blockchain/wallet';
import { UserContext } from '../../contexts/UserContext';
import { AppContext } from '../../contexts/AppContext';
import OTP from '../../constants/otp';

export default function OTPVerify() {
	let history = useHistory();
	const [otp, setOtp] = useState('');
	const { verifyOTP } = useContext(UserContext);
	const { setWallet } = useContext(AppContext);
	const [loadingMessage] = useState('Please wait, creating your wallet');
	const [loadingModal, setLoadingModal] = useState(false);

	const location = useLocation();
	const { otpDetails, email } = location.state;

	const handleChange = otp => setOtp(otp);
	const handleClear = () => setOtp('');
	const handleVerify = async () => {
		await verifyOTP({ otp, otpDetails })
			.then(async d => {
				console.log('response from otp verify:', d);
				if (d.status === 'success') {
					//create wallet
					await handleWalletCreate();
				}
			})
			.catch(e => {
				Swal.fire('ERROR', e.data.message, 'error');
			});
	};

	const handleWalletCreate = async () => {
		try {
			setLoadingModal(true);
			const { phone } = await DataService.get('profile');
			const res = await Wallet.create(phone);
			if (res) {
				const { wallet, encryptedWallet } = res;
				await DataService.save('temp_encryptedWallet', encryptedWallet);
				setWallet(wallet);
				history.push('/create');
			}
		} catch (err) {
			Swal.fire('ERROR', err.message, 'error');
		} finally {
			setLoadingModal(false);
		}
	};

	useEffect(() => {
		console.log(otp);
	}, [otp]);

	return (
		<>
			<Loading message={loadingMessage} showModal={loadingModal} />
			<div id="appCapsule" className="h-100">
				<div className="d-flex justify-content-center align-items-center">
					<div className="col-md-12 text-center">
						<img src="/assets/img/icon/hlb-512.png" width="240" alt="Hamro LifeBank" />
					</div>
				</div>
				<div className="section pt-1">
					<div className="card" style={{ paddingTop: 50, paddingLeft: 5, paddingRight: 5 }}>
						<div className="balance">
							<div className="">
								<div style={{ paddingLeft: 20, paddingRight: 20 }}>
									<h2 className="value text-center">Enter the verification code </h2>
									<h4>A verification code has been sent to your email&nbsp;({email}).</h4>
								</div>
								<div
									className="card-body d-flex flex-column justify-content-center align-items-center"
									style={{ height: '200px' }}
								>
									<OtpInput
										value={otp}
										onChange={handleChange}
										numInputs={OTP.LENGTH}
										separator={<span>-</span>}
										containerStyle={'form-group d-flex justify-content-center w-50'}
										inputStyle={'form-control p-0 w-100'}
									/>
									<br />
									<div className="row">
										<div className="col-xs-6">
											<button className="btn btn-danger" onClick={handleClear}>
												Clear
											</button>
										</div>
										<div className="col-xs-6 ml-2">
											{' '}
											{otp.length === OTP.LENGTH ? (
												<button className="btn btn-primary" onClick={handleVerify}>
													Verify
												</button>
											) : (
												<button className="btn btn-primary" disabled>
													Verify
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
