import jwtService from 'app/services/jwtService';
import * as Actions from 'app/store/actions';
import axios from 'axios';


export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const GET_BETTING_COMPANIES = 'GET_BETTING_COMPANIES';

export function submitRegister(user) {
	return dispatch =>
		jwtService
			.createUser(user)
			.then(user => {
				dispatch(
					Actions.showMessage({
						message: user.message, //text or html
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
					payload: user
				});
			})
			.catch(error => {
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
				// return dispatch({
				// 	type: REGISTER_ERROR,
				// 	payload: error
				// });
			});
}

export function getBettingCompanies() {
	const request = axios.get('/bettingCompany/allByCountry/');
	return dispatch =>
		request
			.then(response => {
				dispatch({
					type: GET_BETTING_COMPANIES,
					payload: response.data.data ? response.data.data : []
				})
			})
			.catch(error =>
				dispatch({
					type: GET_BETTING_COMPANIES,
					payload: []
				})
			);
}
