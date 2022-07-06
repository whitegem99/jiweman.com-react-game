import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_BETTING_COMPANIES= '[PROJECT DASHBOARD APP] GET BETTING COMPANIES';
export const APPROVE_COMPANY= 'APPROVE COMPANY';

export function getBettingCompanies(params) {
	const request = axios.get('/bettingCompany', {
		params
	});

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_BETTING_COMPANIES,
				payload: response.data
			})
		);
}

export function approveBettingCompany(id) {
	const request = axios.post('/bettingCompany/approve', {
		id
	});

	return dispatch =>
		request.then(response => {
			dispatch(
				MessageActions.showMessage({
					message: "Company Approved", //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'right' //left center right
					},
					variant: 'success' //success error info warning null
				})
			);
		
		});
}

export function deactivateBettingCompany(id) {
	const request = axios.post('/bettingCompany/deactivate', {
		id
	});

	return dispatch =>
		request.then(response => {
			dispatch(
				MessageActions.showMessage({
					message: "Company Deactivated", //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'right' //left center right
					},
					variant: 'success' //success error info warning null
				})
			);
		
		});
}

export function activateBettingCompany(id) {
	const request = axios.post('/bettingCompany/activate', {
		id
	});

	return dispatch =>
		request.then(response => {

		dispatch(getBettingCompanies({ page: 0, limit: 10 }));
		
			dispatch(
				MessageActions.showMessage({
					message: "Company Activated", //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'right' //left center right
					},
					variant: 'success' //success error info warning null
				})
			);
		
		});
}
