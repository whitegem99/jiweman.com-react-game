import axios from 'axios';
import store from 'app/store';

import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_LEAGUE = '[PROJECT DASHBOARD APP] GET LEAGUE';
export const GET_ONEONONE = 'GET_ONEONONE';
export const TOGGLE_PRIZE_PANEL_CLOSE = 'TOGGLE_PRIZE_PANEL_CLOSE';
export const TOGGLE_PRIZE_PANEL_OPEN = 'TOGGLE_PRIZE_PANEL_OPEN';

export function getLeague() {
	const request = axios.get('/leagueForPlayers');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_LEAGUE,
				payload: response.data.data
			})
		);
}

export function getOneOnOne() {
	const request = axios.get('/getOneonOneCards');

	return dispatch =>
		request.then(response => 
			dispatch({
				type: GET_ONEONONE,
				payload: response.data.data || []
			})
		);
}

export function joinFreeLeague(req) {
	const request = axios.post('/joinFreeLeague', { ...req, userId: store.getState().auth.user.data._id });

	return dispatch =>
		request.then(response => {
			dispatch(
				MessageActions.showMessage({
					message: response.data.message, //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'right' //left center right
					},
					variant: 'success' //success error info warning null
				})
			);
			return dispatch(getLeague());
		});
}

export function togglePanelClose() {
	return {
		type: TOGGLE_PRIZE_PANEL_CLOSE,
		payload: null
	};
}

export function togglePanelOpen(payload) {
	return {
		type: TOGGLE_PRIZE_PANEL_OPEN,
		payload
	};
}