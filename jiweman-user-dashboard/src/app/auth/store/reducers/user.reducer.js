import * as Actions from '../actions';

const initialState = {
	role: [], // guest
	data: {
		displayName: 'John Doe',
		photoURL: 'assets/images/avatars/Velazquez.jpg',
		email: 'johndoe@example.com',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	},
	verificationDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	}
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case Actions.SET_USER_DATA: {
			return {
				...initialState,
				...action.payload
			};
		}
		case Actions.REMOVE_USER_DATA: {
			return {
				...initialState
			};
		}
		case Actions.USER_LOGGED_OUT: {
			return initialState;
		}
		case Actions.OPEN_VERIFICATION_DIALOG: {
			return {
				...state,
				verificationDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: action.payload
				}
			};
		}
		case Actions.CLOSE_VERIFICATION_DIALOG: {
			return {
				...state,
				verificationDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: action.payload
				}
			};
		}
		default: {
			return state;
		}
	}
};

export default user;
