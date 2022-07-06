import jwtService from 'app/services/jwtService';
// import * as Actions from 'app/store/actions';
import * as UserActions from './user.actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';


export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({ email, password }) {
	return dispatch =>
		jwtService
			.signInWithEmailAndPassword(email, password)
			.then(user => {
				dispatch(UserActions.setUserData(user));

				return dispatch({
					type: LOGIN_SUCCESS
				});
			})
			.catch(error => {
				// console.log(error)
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
					type: LOGIN_ERROR,
					payload: error
				});
			});
}
