import axios from 'axios';
import * as Actions from 'app/store/actions';
import * as leagueActions from './league.actions';
export const TOGGLE_PROCESS_LEAGUE_PANEL_OPEN = 'TOGGLE_PROCESS_LEAGUE_PANEL_OPEN';
export const TOGGLE_PROCESS_LEAGUE_PANEL_CLOSE = 'TOGGLE_PROCESS_LEAGUE_PANEL_CLOSE';

export const GET_LEAGUE_PANEL_DATA = 'GET_LEAGUE_PANEL_DATA';
export const PROCESS_WINNERS_SUCCESSFUL = 'PROCESS_WINNERS_SUCCESSFUL';

export function getWinnerList(req) {
	const request = axios.post('/getLeagueWinners', req);
	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_LEAGUE_PANEL_DATA,
				payload: response.data.data
			})
		);
}
export function initiateProcessLeague(req) {
	const request = axios.post('/processLeagueWinners', req);
	return dispatch =>
		request.then(response => {
			if (response.data && response.data.status) {
				dispatch(
					Actions.showMessage({
						message: response.data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
				dispatch(leagueActions.getPlayers());
				return dispatch({
					type: PROCESS_WINNERS_SUCCESSFUL
				});
			}
		});
}

export function togglePanelClose() {
	return {
		type: TOGGLE_PROCESS_LEAGUE_PANEL_CLOSE,
		payload: null
	};
}

export function togglePanelOpen(payload) {
	return {
		type: TOGGLE_PROCESS_LEAGUE_PANEL_OPEN,
		payload
	};
}
