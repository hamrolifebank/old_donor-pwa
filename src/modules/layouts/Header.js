import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { IoWalletOutline, IoHomeOutline } from 'react-icons/io5';

export default function Header() {
	const { wallet, setWallet } = useContext(AppContext);

	const handleLockAppClick = () => {
		setWallet(null);
	};

	return (
		<div>
			{wallet && (
				<div className="appHeader bg-primary scrolled">
					<div className="left d-none">
						<a href="fake_value" className="headerButton" data-toggle="modal" data-target="#sidebarPanel">
							<IoHomeOutline className="ion-icon" />
						</a>
					</div>
					<div className="pageTitle">
						<img src="assets/img/icon/hlb-white-512.png" width="70" alt="logo" className="logo" />
						&nbsp;<i>Hamro</i>&nbsp;LifeBank Wallet
					</div>
					<div className="right">
						<a
							href="#lock"
							title="Lock wallet"
							onClick={handleLockAppClick}
							className="headerButton logout"
						>
							<IoWalletOutline className="ion-icon" />
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
