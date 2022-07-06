import axios from 'axios';

export const GET_WALLET_HISTORY = 'GET_WALLET_HISTORY';
export const OPEN_PAYMENT_DIALOG_WALLET = 'OPEN_PAYMENT_DIALOG_WALLET';
export const CLOSE_PAYMENT_DIALOG_WALLET = 'CLOSE_PAYMENT_DIALOG_WALLET';
export const GET_WALLET_BALANCE = 'GET_WALLET_BALANCE';
export const OPEN_TRANSFER_DIALOG = 'OPEN_TRANSFER_DIALOG';
export const CLOSE_TRANSFER_DIALOG = 'CLOSE_TRANSFER_DIALOG';

export function getWalletHistory(rp) {
	const request = axios.get('/wallet/getWalletTransactionsAdmin/');
	return dispatch =>
		request
			.then(response =>
				dispatch({
					type: GET_WALLET_HISTORY,
					payload: response.data ? response.data : []
				})
			)
			.catch(error =>
				dispatch({
					type: GET_WALLET_HISTORY,
					payload: []
				})
			);
}

export function getWalletBalance(rp) {
	const request = axios.get('/wallet/walletBalanceAdmin/'+ rp.playerId);
	return dispatch =>
		request
			.then(response =>
				dispatch({
					type: GET_WALLET_BALANCE,
					payload: response.data
				})
			)
			.catch(error =>
				dispatch({
					type: GET_WALLET_BALANCE,
					payload: []
				})
			);
}

export function openPaymentDialog() {
	console.log('open');
	return {
		type: OPEN_PAYMENT_DIALOG_WALLET,
		payload: null
	};
}

export function closePaymentDialog() {
	return {
		type: CLOSE_PAYMENT_DIALOG_WALLET,
		payload: null
	};
}

export function openTransferDialog() {
	return {
		type: OPEN_TRANSFER_DIALOG,
		payload: null
	};
}

export function closeTransferDialog() {
	return dispatch => {
		dispatch(getWalletHistory());
		dispatch(getWalletBalance());
		return dispatch({
			type: CLOSE_TRANSFER_DIALOG,
			payload: null
		});
	};
}

