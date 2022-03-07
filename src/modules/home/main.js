import React, { useState, useContext, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useResize } from '../../utils/react-utils';
import { AppContext } from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
var QRCode = require('qrcode.react');

export default function Main() {
	const { hasWallet, wallet } = useContext(AppContext);
	const { getUserInfo } = useContext(UserContext);
	const [showPageLoader, setShowPageLoader] = useState(true);
	const [userInfo, setUserInfo] = useState({ totalDonations: 0, bloodGroup: 'N/A', name: '', email: '', phone: '' });

	const cardBody = useRef();
	const { width } = useResize(cardBody);

	const calcQRWidth = () => {
		if (width < 200) return 200;
		else return 280;
	};

	const fetchUserInfo = () => {
		return getUserInfo().then(d => {
			let obj = {
				totalDonations: d.donations ? d.donations.length : 0,
				name: d.name,
				email: d.email,
				phone: d.phone
			};
			if (d.blood_info.group && d.blood_info.rh_factor)
				obj.bloodGroup = `${d.blood_info.group}${d.blood_info.rh_factor}`;
			setUserInfo(obj);
		});
	};

	useEffect(
		() => {
			fetchUserInfo();
		}, // eslint-disable-next-line
		[]
	);

	setTimeout(() => {
		setShowPageLoader(false);
	}, 600);

	if (!hasWallet) {
		return <Redirect to="/setup" />;
	}

	return (
		<>
			{showPageLoader && (
				<div id="loader">
					<img src="/assets/img/icon/hlb-white-512.png" alt="icon" className="loading-icon" />
				</div>
			)}

			<div id="appCapsule">
				<div className="section wallet-card-section pt-1">
					<div className="card" style={{ height: 365, paddingLeft: 2, paddingRight: 2 }}>
						<div className="balance">
							<div className="">
								<div className="card-body text-center mt-3" ref={cardBody}>
									{wallet !== null ? (
										<>
											<QRCode value={wallet.address} size={calcQRWidth()} />
											{/* <div className="mt-1" style={{ fontSize: 13 }}>
												{wallet.address}
											</div> */}
											<div className="mt-2" style={{ fontSize: 11, lineHeight: 1.5 }}>
												This QR Code (address) is your unique identity.
											</div>
										</>
									) : (
										<div>Loading...</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div
						className="card mt-3 mb-2 d-flex flex-row align-items-center"
						style={{ height: 50, paddingLeft: 16, paddingRight: 16 }}
					>
						<i className="fa-solid fa-user fa-warning mr-3"></i>
						<div>{userInfo.name}</div>
					</div>
					<div
						className="card mb-2 d-flex flex-row align-items-center"
						style={{ height: 50, paddingLeft: 16, paddingRight: 16 }}
					>
						<i class="fa fa-envelope fa-secondary mr-3" aria-hidden="true"></i>
						<div>{userInfo.email}</div>
					</div>
					<div
						className="card mb-2 d-flex flex-row align-items-center"
						style={{ height: 50, paddingLeft: 16, paddingRight: 16 }}
					>
						<i class="fa fa-phone fa-success mr-3" aria-hidden="true"></i>
						<div>{userInfo.phone}</div>
					</div>
					<div className="row">
						<div
							className="col card mx-2 d-flex flex-column align-items-center"
							style={{
								height: 100,
								paddingLeft: 16,
								paddingRight: 16,
								paddingTop: 16,
								paddingBottom: 16
							}}
						>
							<div>
								<i className="fa-solid fa-droplet fa-primary mr-2"></i> Total Donations
							</div>
							<h1>{userInfo.totalDonations}</h1>
						</div>
						<div
							className="col card mx-2 d-flex flex-column align-items-center"
							style={{
								height: 100,
								paddingLeft: 16,
								paddingRight: 16,
								paddingTop: 16,
								paddingBottom: 16
							}}
						>
							<div>
								<i className="fa fa-heartbeat fa-primary mr-2"></i> Blood Group
							</div>
							<h1>{userInfo.bloodGroup}</h1>
						</div>
					</div>
				</div>
				<div id="cmpCreateWallet">
					<div className="text-center">
						{hasWallet && !wallet && <strong>Tap on lock icon to unlock</strong>}
					</div>
				</div>
			</div>
		</>
	);
}
