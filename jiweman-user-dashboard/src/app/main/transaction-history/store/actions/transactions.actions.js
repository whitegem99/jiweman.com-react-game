import axios from 'axios';

export const GET_TRANSACTION_HISTORY = 'GET_TRANSACTION_HISTORY';

export function getTransactionHistory() {
	const request = axios.get('/auth/userTransactionHistory');
	return dispatch =>
		request
			.then(response =>
				dispatch({
					type: GET_TRANSACTION_HISTORY,
					payload: response.data.data ? response.data.data : []
				})
			)
			.catch(error =>
				dispatch({
					type: GET_TRANSACTION_HISTORY,
					payload: []
				})
			);
}
