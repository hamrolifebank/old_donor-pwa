import React, { createContext, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';
import { useHistory } from 'react-router-dom';
import hash from 'object-hash';

const initialState = {
	sendingTokenName: '',
	address: null,
	network: null,
	wallet: null,
	hasWallet: true,
	scannedEthAddress: '',
	scannedAmount: null
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);
	const history = useHistory();

	const initApp = useCallback(async () => {
		DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
		//TODO: in future check version and add action if the version is different.
		DataService.save('version', APP_CONSTANTS.VERSION);
		let data = await DataService.initAppData();
		data.hasWallet = data.wallet === null ? false : true;
		if (!data.hasWallet) localStorage.removeItem('address');
		dispatch({ type: APP_ACTIONS.INIT_APP, data });
	}, [dispatch]);

	function setHasWallet(hasWallet) {
		dispatch({ type: APP_ACTIONS.SET_HASWALLET, data: hasWallet });
	}

	function setWallet(wallet) {
		dispatch({ type: APP_ACTIONS.SET_WALLET, data: wallet });
	}

	function setNetwork(network) {
		dispatch({ type: APP_ACTIONS.SET_NETWORK, data: network });
	}

	function saveScannedAddress(data) {
		dispatch({ type: APP_ACTIONS.SET_SCCANNED_DATA, data });
	}

	function saveSendingTokenName(symbol) {
		dispatch({ type: APP_ACTIONS.SET_SENDING_TOKEN_NAME, data: symbol });
	}

	async function signAuthSignature(wallet) {
		let timeStamp = Date.now();
		let signed = await wallet.signMessage(timeStamp.toString());
		const signature = timeStamp + '.' + signed;
		return signature;
	}

	async function signDataSignature(wallet, data = {}) {
		const mdHash = hash.MD5(data);
		let signed = await wallet.signMessage(mdHash);
		const signature = mdHash + '.' + signed;
		return signature;
	}

	async function signAndCallService(passedFunc, passedParams) {
		let wallet = state.wallet;

		let hasWallet = state.hasWallet;
		let payload;
		try {
			if (hasWallet && !wallet) {
				wallet = await unlockWallet();
			} else if (!hasWallet) {
				history.push('/setup');
				return;
			}
			let auth_signature = await signAuthSignature(wallet);
			let data_signature;

			if (passedParams) {
				data_signature = await signDataSignature(wallet, passedParams);
				payload = {
					...passedParams,
					auth_signature,
					data_signature
				};
			} else {
				payload = {
					...passedParams,
					auth_signature
				};
			}
			return passedFunc(payload);
		} catch (err) {
			throw err;
		}
	}

	return (
		<AppContext.Provider
			value={{
				address: state.address,
				scannedEthAddress: state.scannedEthAddress,
				scannedAmount: state.scannedAmount,
				hasWallet: state.hasWallet,
				network: state.network,
				wallet: state.wallet,
				sendingTokenName: state.sendingTokenName,
				initApp,
				saveSendingTokenName,
				saveScannedAddress,
				setHasWallet,
				setNetwork,
				setWallet,
				dispatch,
				signAndCallService
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
