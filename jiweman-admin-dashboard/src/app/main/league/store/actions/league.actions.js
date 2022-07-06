import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_LEAGUE = '[PROJECT DASHBOARD APP] GET LEAGUE';
export const OPEN_NEW_LEAGUE_DIALOG = '[LEAGUE APP] OPEN NEW LEAGUE DIALOG';
export const CLOSE_NEW_LEAGUE_DIALOG = '[LEAGUE APP] CLOSE NEW LEAGUE DIALOG';
export const OPEN_EDIT_LEAGUE_DIALOG = '[LEAGUE APP] OPEN EDIT LEAGUE DIALOG';
export const CLOSE_EDIT_LEAGUE_DIALOG = '[LEAGUE APP] CLOSE EDIT LEAGUE DIALOG';
export const ADD_LEAGUE = '[LEAGUE APP] ADD LEAGUE';
export const EDIT_LEAGUE = '[LEAGUE APP] EDIT_LEAGUE';
export const TOGGLE_PRIZE_LIST_PANEL_OPEN = 'TOGGLE_PRIZE_LIST_PANEL_OPEN';
export const TOGGLE_PRIZE_LIST_PANEL_CLOSE = 'TOGGLE_PRIZE_LIST_PANEL_CLOSE';

export function getPlayers() {
	const request = axios.get('/leagueForAdmin');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_LEAGUE,
				payload: response.data.data
			})
		);
}

export function addLeague(req) {
	console.log(req)
	const request = axios.post('/addLeague', req);
	return dispatch =>
		request.then(response => {
			// Promise.all([
			// 	dispatch({
			// 		type: ADD_LEAGUE
			// 		// payload: response.data.data
			// 	})
			// ]).then(() => dispatch(getPlayers()))
			if (response.data.status) {
				dispatch(getPlayers())
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
			}
		});
}

export function editLeague(req) {
	const request = axios.put('/updateLeague/' + req._id, req);
	return dispatch =>
		request.then(response =>
			Promise.all([
				dispatch({
					type: EDIT_LEAGUE
					// payload: response.data.data
				})
			]).then(() => dispatch(getPlayers()))
		);
}

export function openNewLeagueDialog() {
	return {
		type: OPEN_NEW_LEAGUE_DIALOG
	};
}

export function closeNewLeagueDialog() {
	return {
		type: CLOSE_NEW_LEAGUE_DIALOG
	};
}

export function openEditLeagueDialog(data) {
	return {
		type: OPEN_EDIT_LEAGUE_DIALOG,
		data
	};
}

export function closeEditLeagueDialog() {
	return {
		type: CLOSE_EDIT_LEAGUE_DIALOG
	};
}

export function togglePrizeListPanelClose() {
	return {
		type: TOGGLE_PRIZE_LIST_PANEL_CLOSE,
		payload: null
	};
}

export function togglePrizeListPanelOpen(payload) {
	return {
		type: TOGGLE_PRIZE_LIST_PANEL_OPEN,
		payload
	};
}