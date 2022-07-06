import jwtService from 'app/services/jwtService';
import * as Actions from 'app/store/actions';

export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export function submitRegister(user) {
	return dispatch =>
		jwtService
			.createUser(user)
			.then(data => {
				console.log(data);

				dispatch(
					Actions.showMessage({
						message: "Registered succesfully", //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
				window.location.href = './login'; //one level up

				return dispatch({
					type: REGISTER_SUCCESS,
					payload: data
				});
			})
			.catch(error => {
				console.log("error")
				console.log(error)
				if(error){
					dispatch(
						Actions.showMessage({
							message: error.message, //text or html
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
