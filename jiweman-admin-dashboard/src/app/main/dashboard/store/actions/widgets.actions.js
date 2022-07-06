import axios from 'axios';

export const GET_WIDGETS = '[PROJECT DASHBOARD APP] GET WIDGETS';

export function getWidgets() {
	const request = axios.get('/analytics/statsfromcache');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_WIDGETS,
				payload: response.data.data
			})
		);
}

export function updateWidgets() {
	const request = axios.get('/analytics/stats');

	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_WIDGETS,
				payload: response.data.data
			});
		});
}
