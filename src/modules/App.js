import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../modules/home';
import Setup from '../modules/setup';
import SetupProfile from '../modules/setup/profile';
import OtpVerify from '../modules/setup/otpVerify';
import UnlockWallet from '../modules/wallet/unlock';
import GoogleRestore from '../modules/misc/googleRestore';
import CreateWallet from '../modules/wallet/create';
import ResetWallet from '../modules/misc/reset';
import RestoreFromMnemonic from '../modules/wallet/restoreMnemonic';

import { ToastProvider } from 'react-toast-notifications';
import { AppContextProvider } from '../contexts/AppContext';
import { UserContextProvider } from '../contexts/UserContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<UserContextProvider>
					<ToastProvider>
						<BrowserRouter>
							<Switch>
								<Route exact path="/setup" component={Setup} />
								<Route exact path="/setup/profile" component={SetupProfile} />
								<Route exact path="/otp-verify" component={OtpVerify} />
								<Route exact path="/create" component={CreateWallet} />
								<Route exact path="/unlock" component={UnlockWallet} />
								<Route exact path="/google/restore" component={GoogleRestore} />
								<Route exact path="/mnemonic/restore" component={RestoreFromMnemonic} />
								<Route exact path="/reset" component={ResetWallet} />
								<Route path="/" component={Home} />
								<Route path="*" component={Home} />
							</Switch>
						</BrowserRouter>
					</ToastProvider>
				</UserContextProvider>
			</AppContextProvider>
		</>
	);
}

export default App;
