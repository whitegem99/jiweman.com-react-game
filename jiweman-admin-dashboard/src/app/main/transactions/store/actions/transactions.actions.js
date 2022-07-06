import axios from 'axios';

export const GET_TRANSACTIONS = '[PROJECT DASHBOARD APP] GET TRANSACTIONS';

export function getTransactions(params) {
	const request = axios.get('/auth/transactionHistoryForAdmin', {
		params
	});

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_TRANSACTIONS,
				payload: response.data
			})
		);
}
