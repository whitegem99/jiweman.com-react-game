import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_PLAYERS = '[PROJECT DASHBOARD APP] GET PLAYERS';

export function getPlayers() {
	const request = axios.get('/playerStats');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_PLAYERS,
				payload: response.data.data
			})
		);
}


export function banPlayer(id, isUserBanned, banReason) {
	console.log(id, isUserBanned, banReason)
	const request = axios.post('/auth/updateBanStatus', {
		id, isUserBanned, banReason
	});

	return dispatch =>
		request.then(response => {
			dispatch(getPlayers())
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
			)
		}
		);
}

export function warnPlayer(id, warnReason) {

	const request = axios.post('/auth/warn', {
		id, warnReason
	});

	return dispatch =>
		request.then(response => {
			dispatch(getPlayers())
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
			)
		}
		);
}
