import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_GAME = '[PROJECT DASHBOARD APP] GET GAME';
export const OPEN_NEW_GAME_DIALOG = '[GAME APP] OPEN NEW GAME DIALOG';
export const CLOSE_NEW_GAME_DIALOG = '[GAME APP] CLOSE NEW GAME DIALOG';
export const OPEN_EDIT_GAME_DIALOG = '[GAME APP] OPEN EDIT GAME DIALOG';
export const CLOSE_EDIT_GAME_DIALOG = '[GAME APP] CLOSE EDIT GAME DIALOG';
export const ADD_GAME = '[GAME APP] ADD GAME';
export const EDIT_GAME = '[GAME APP] EDIT_GAME';

export function getGame() {
	const request = axios.get('/oneononeforadmin');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_GAME,
				payload: response.data.data
			})
		);
}

export function addGame(req) {
	const request = axios.post('/oneonone', req);
	return dispatch =>
		request.then(response =>
			Promise.all([
				dispatch({
					type: ADD_GAME
					// payload: response.data.data
				})
			]).then(() => dispatch(getGame()))
		).catch((error => {
			console.log(error.response)
			if (error.response.data && !error.response.data.status) {
				dispatch(
					MessageActions.showMessage({
						message: error.response.data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);
			}
		}));
}

export function editGame(req) {
	const request = axios.put('/oneonone/' + req._id, req);
	return dispatch =>
		request.then(response =>
			Promise.all([
				dispatch({
					type: EDIT_GAME
					// payload: response.data.data
				})
			]).then(() => dispatch(getGame()))
		).catch((error => {
			console.log(error.response)
			if (error.response.data && !error.response.data.status) {
				dispatch(
					MessageActions.showMessage({
						message: error.response.data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);
			}
		}));;
}

export function openNewGameDialog() {
	return {
		type: OPEN_NEW_GAME_DIALOG
	};
}

export function closeNewGameDialog() {
	return {
		type: CLOSE_NEW_GAME_DIALOG
	};
}

export function openEditGameDialog(data) {
	return {
		type: OPEN_EDIT_GAME_DIALOG,
		data
	};
}

export function closeEditGameDialog() {
	return {
		type: CLOSE_EDIT_GAME_DIALOG
	};
}
