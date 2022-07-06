import axios from 'axios';

export const GET_SETTINGS = 'GET SETTINGS';
export const GET_PRIZE_CONFIG = 'GET_PRIZE_CONFIG';
export const OPEN_NEW_PRIZE_CONFIG_DIALOG = 'OPEN_NEW_PRIZE_CONFIG_DIALOG';
export const CLOSE_NEW_PRIZE_CONFIG_DIALOG = 'CLOSE_NEW_PRIZE_CONFIG_DIALOG';
export const OPEN_EDIT_PRIZE_CONFIG_DIALOG = 'OPEN_EDIT_PRIZE_CONFIG_DIALOG';
export const CLOSE_EDIT_PRIZE_CONFIG_DIALOG = 'CLOSE_EDIT_PRIZE_CONFIG_DIALOG';
export const GET_APP_LIST = 'GET_APP_LIST';

export function getSettings() {
	const request = axios.get('/pointsInfo');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_SETTINGS,
				payload: response.data.data
			})
		);
}

export function getPrizeConfig() {
	const request = axios.get('/getprizePercentage');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_PRIZE_CONFIG,
				payload: response.data.data
			})
		);
}

export function getAppList() {
	const request = axios.get('/settings/getapp');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_APP_LIST,
				payload: response.data.data
			})
		);
}

export function editSupportedVersion(body) {
	const request = axios.post('/settings/editAppSupportedVersion', body);

	return dispatch => request.then(response => dispatch(getAppList()));
}

export function addPrizeConfig(req) {
	const request = axios.post('/getprizePercentage', req);
	return dispatch => request.then(response => dispatch(getPrizeConfig()));
}

export function editPrizeConfig(req) {
	const request = axios.put('/getprizePercentage/' + req._id, req);
	return dispatch => request.then(response => dispatch(getPrizeConfig()));
}

export function deletePrizeConfig(req) {
	const request = axios.delete('/getprizePercentage/' + req._id, req);
	return dispatch => request.then(response => dispatch(getPrizeConfig()));
}

export function openNewPrizeConfigDialog() {
	return {
		type: OPEN_NEW_PRIZE_CONFIG_DIALOG
	};
}

export function closeNewPrizeConfigDialog() {
	return {
		type: CLOSE_NEW_PRIZE_CONFIG_DIALOG
	};
}

export function openEditPrizeConfigDialog(data) {
	return {
		type: OPEN_EDIT_PRIZE_CONFIG_DIALOG,
		data
	};
}

export function closeEditPrizeConfigDialog() {
	return {
		type: CLOSE_EDIT_PRIZE_CONFIG_DIALOG
	};
}
