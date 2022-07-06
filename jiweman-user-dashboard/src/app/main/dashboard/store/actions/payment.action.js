import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_PAYMENT_OPTIONS = 'GET_PAYMENT_OPTIONS';
export const OPEN_PAYMENT_DIALOG = 'OPEN_PAYMENT_DIALOG';
export const CLOSE_PAYMENT_DIALOG = 'CLOSE_PAYMENT_DIALOG';
export const GET_PAYMENT_PRODIVDERS = 'GET_PAYMENT_PRODIVDERS';
export const RESET_PAYMENT_PRODIVDERS = 'RESET_PAYMENT_PRODIVDERS';
export const SET_COLLECTION_RESPONSE = 'SET_COLLECTION_RESPONSE';
export const SET_COLLECTION_RESPONSE_ERR = 'SET_COLLECTION_RESPONSE_ERR'
export function openPaymentDialog(data) {
	return {
		type: OPEN_PAYMENT_DIALOG,
		payload: data
	};
}

export function closePaymentDialog() {
	return {
		type: CLOSE_PAYMENT_DIALOG,
		payload: null
	};
}

export function getPaymentOptions() {
	const request = axios.get('/getPaymentOptions');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_PAYMENT_OPTIONS,
				payload: response.data.paymentMethod
			})
		);
}

export function getPaymentProviders(mode) {
	const request = axios.get('/paymentOptionsOrProviders/' + mode);
	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_PAYMENT_PRODIVDERS,
				payload: response.data.data
			})
		);
}

export function makeCollectionRequest(req) {
	const request = axios.post('/collections', req);
	return dispatch =>
		request.then(response => {
			if (response.data.status !== 'error') {
				return dispatch({
					type: SET_COLLECTION_RESPONSE,
					payload: response.data.data
				});
			}else{
				dispatch(
					MessageActions.showMessage({
						message: response.data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);

				return dispatch({
					type: SET_COLLECTION_RESPONSE_ERR,
					payload: response.data.data
				});
			}
		});
}

export function resetPaymentProviders() {
	return dispatch =>
		dispatch({
			type: RESET_PAYMENT_PRODIVDERS
		});
}
