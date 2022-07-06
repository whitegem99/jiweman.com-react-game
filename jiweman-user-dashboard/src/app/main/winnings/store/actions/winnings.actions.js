import store from 'app/store';
import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_WINNINGS = 'GET WINNINGS';
export const OPEN_WINNINGS_DIALOG = 'OPEN_WINNINGS_DIALOG';
export const CLOSE_WINNINGS_DIALOG = 'CLOSE_WINNINGS_DIALOG';

export function getWinnings() {
	const paramsObj = {
		userId: store.getState().auth.user.data._id
	};
	const request = axios.post('/getPlayerLeagueWinningHistory', paramsObj);

	return dispatch =>
		request
			.then(response =>
				dispatch({
					type: GET_WINNINGS,
					payload: response.data.data ? response.data.data : []
				})
			)
			.catch(error =>
				dispatch({
					type: GET_WINNINGS,
					payload: []
				})
			);
}

export function claimLeaguePrize(req) {
	const request = axios.post('/auth/claimLeagueWinning', req);

	return dispatch =>
		request
			.then(response => {
				console.log(response);
				dispatch(
					MessageActions.showMessage({
						message: 'Prize Claimed. Amount added to wallet. Enjoy Playing...!!', //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
			})
			.finally(() => {
				dispatch(getWinnings());
			});
}

export function openWinningDialog(data) {
	return {
		type: OPEN_WINNINGS_DIALOG,
		payload: data
	};
}

export function closeWinningDialog() {
	return dispatch => {
		dispatch(getWinnings());
		return dispatch({
			type: CLOSE_WINNINGS_DIALOG,
			payload: null
		});
	};
}
