import React, { useEffect, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';

import { AppContext } from '../../contexts/AppContext';
import PrivateRoute from './PrivateRoute';

import BackupWallet from '../wallet/backup/index';
import Footer from '../layouts/Footer';
import Header from '../layouts/Header';
import Main from './main';
import NetworkSettings from '../settings/network';
import Profile from '../settings';
import Settings from '../settings/misc';
import Transfer from '../transfer';
import GoogleBackup from '../misc/googleBackup';
import Events from '../events';
import DonationHistory from '../donationHistory';

function App() {
	const { initApp, wallet } = useContext(AppContext);

	useEffect(() => {
		(async () => {
			initApp();
		})();
	}, [initApp]);

	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<PrivateRoute exact path="/events" component={Events} wallet={wallet} />
				<PrivateRoute exact path="/donation-history" component={DonationHistory} wallet={wallet} />
				<PrivateRoute exact path="/backup" component={BackupWallet} wallet={wallet} />
				<PrivateRoute exact path="/networks" component={NetworkSettings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/settings" component={Settings} wallet={wallet} />
				<PrivateRoute exact path="/transfer/:contract" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/transfer/:contract/:address" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/google/backup" component={GoogleBackup} wallet={wallet} />
				<Route path="*" component={Main} />
			</Switch>
			<Footer />
		</>
	);
}

export default App;
