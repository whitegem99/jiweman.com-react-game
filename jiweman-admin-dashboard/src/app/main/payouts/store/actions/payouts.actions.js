import axios from 'axios';

export const GET_PAYOUTS = '[PROJECT DASHBOARD APP] GET PAYOUTS';

export function getPayouts(params) {
	const request = axios.get('/getWinningTransactionForAdmin', {
		params
	});

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_PAYOUTS,
				payload: response.data
			})
		);
}
