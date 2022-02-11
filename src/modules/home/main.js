import React, { useState, useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { useResize } from '../../utils/react-utils';
import { AppContext } from '../../contexts/AppContext';
var QRCode = require('qrcode.react');

export default function Main() {
	const { hasWallet, wallet } = useContext(AppContext);
	const [showPageLoader, setShowPageLoader] = useState(true);

	const cardBody = useRef();
	const { width } = useResize(cardBody);

	const calcQRWidth = () => {
		if (width < 200) return 200;
		else return 280;
	};

	setTimeout(() => {
		setShowPageLoader(false);
	}, 1200);

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
											<div className="mt-1" style={{ fontSize: 13 }}>
												{wallet.address}
											</div>
											<div className="mt-2" style={{ fontSize: 9, lineHeight: 1.5 }}>
												This QR Code (address) is your unique identity. Use this to receive
												digital documents, assets or verify your identity.
											</div>
										</>
									) : (
										<div>Loading...</div>
									)}
								</div>
							</div>
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
