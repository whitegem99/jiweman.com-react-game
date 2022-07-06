import jwtService from 'app/services/jwtService';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const RESET_SUCCESS = 'RESET_SUCCESS';
export const RESET_ERROR = 'RESET_ERROR';

export function forgotPassword({ email }) {
	return dispatch =>
		jwtService
			.forgotPassword(email)
			.then(data => {
				// dispatch(UserActions.setUserData(user));

				// return dispatch({
				// 	type: LOGIN_SUCCESS
				// });
				dispatch(
					MessageActions.showMessage({
						message: data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
			})
			.catch(error => {
				// console.log(error)
				return dispatch(
					MessageActions.showMessage({
						message: error.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);

				//  dispatch({
				// 	type: LOGIN_ERROR,
				// 	payload: error
				// });
			});
}

export function resetPassword(req) {
	return dispatch =>
		jwtService
			.resetPassword(req)
			.then(data => {
				dispatch(
					MessageActions.showMessage({
						message: data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
				return dispatch({
					type: RESET_SUCCESS
				});
			})
			.catch(error => {
				dispatch(
					MessageActions.showMessage({
						message: error.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);

				return dispatch({
					type: RESET_ERROR,
					payload: error
				});
			});
}

export function forgotUsername(email) {
	return dispatch =>
		jwtService
			.forgotUsername(email)
			.then(data => {
				dispatch(
					MessageActions.showMessage({
						message: data.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
			})
			.catch(error => {
				// console.log(error)
				return dispatch(
					MessageActions.showMessage({
						message: error.message, //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);
			});
}
