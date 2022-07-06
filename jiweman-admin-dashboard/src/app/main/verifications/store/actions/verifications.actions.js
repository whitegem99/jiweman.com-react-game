import axios from 'axios';

export const GET_VERIFICATIONS = '[PROJECT DASHBOARD APP] GET_VERIFICATIONS ';

export function getVerifications(params) {
	const request = axios.get('/userVerification', {
		params
	});

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_VERIFICATIONS,
				payload: response.data
			})
		);
}

export function verifyId(id) {
	const request = axios.post('/updateUserStatus', null, {
		params: {
			userverifyId: id
		}
	});

	return dispatch =>
		request.then(response =>
			this.getVerifications()
		);
}
