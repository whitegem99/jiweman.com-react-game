import history from '@history';
import _ from '@lodash';
import jwtService from 'app/services/jwtService';
import * as FuseActions from 'app/store/actions/fuse';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';
export const CLOSE_VERIFICATION_DIALOG = 'CLOSE_VERIFICATION_DIALOG';
export const OPEN_VERIFICATION_DIALOG = 'OPEN_VERIFICATION_DIALOG';

/**
 * Set User Data
 */
export function setUserData(user) {
	return dispatch => {
		/*
        You can redirect the logged-in user to a specific route depending on his role
         */

		// history.location.state = {
		//     redirectUrl: user.redirectUrl // for example 'apps/academy'
		// }

		/*
        Set User Settings
         */
		// dispatch(FuseActions.setDefaultSettings(user.data.settings));
		// console.log(user);
		/*
        Set User Data
         */
		dispatch({
			type: SET_USER_DATA,
			payload: { data: { ...user, displayName: user.fullName }, role: ['player'] }
		});
	};
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
	return (dispatch, getState) => {
		const oldUser = getState().auth.user;
		const user = _.merge({}, oldUser, { data: { settings } });

		// updateUserData(user, dispatch);

		return dispatch(setUserData(user));
	};
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		const newUser = {
			...user,
			data: {
				...user.data,
				shortcuts
			}
		};

		updateUserData(newUser, dispatch);

		return dispatch(setUserData(newUser));
	};
}

/**
 * Remove User Data
 */
export function removeUserData() {
	return {
		type: REMOVE_USER_DATA
	};
}

/**
 * Logout
 */
export function logoutUser() {
	return (dispatch, getState) => {
		const { user } = getState().auth;

		if (!user.role || user.role.length === 0) {
			// is guest
			return null;
		}

		history.push({
			pathname: '/'
		});

		jwtService.logout();

		dispatch(FuseActions.setInitialSettings());

		return dispatch({
			type: USER_LOGGED_OUT
		});
	};
}

export function openVerificationDialog() {
	console.log('Open Verification')
	return {
		type: OPEN_VERIFICATION_DIALOG,
		payload: null
	};
}

export function closeVerificationDialog() {
	return {
		type: CLOSE_VERIFICATION_DIALOG,
		payload: null
	};
}

/**
 * Update User Data
 */
function updateUserData(user, dispatch) {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}

	jwtService
		.updateUserData(user)
		.then(() => {
			dispatch(MessageActions.showMessage({ message: 'User data saved with api' }));
		})
		.catch(error => {
			dispatch(MessageActions.showMessage({ message: error.message }));
		});
}
