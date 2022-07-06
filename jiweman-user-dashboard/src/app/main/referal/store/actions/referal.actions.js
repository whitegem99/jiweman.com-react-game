import axios from 'axios';

export const GET_REFERAL_CODE = 'GET_REFERAL_CODE';

export function getReferal() {
	const request = axios.get('/auth/getReferCode');
	return dispatch =>
		request
			.then(response =>
				dispatch({
					type: GET_REFERAL_CODE,
					payload: response.data.data ? response.data.data : []
				})
			)
			.catch(error =>
				dispatch({
					type: GET_REFERAL_CODE,
					payload: []
				})
			);
}
