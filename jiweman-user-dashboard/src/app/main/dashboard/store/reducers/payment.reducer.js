import * as Actions from '../actions';

const initialState = {
	paymentDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
	paymentOptions: [],
	paymentProviders: null,
	paymentCollection: {
		loading: true,
		data: null,
		success: true
	}
};

const paymentReducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.OPEN_PAYMENT_DIALOG: {
			return {
				...state,
				paymentDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: action.payload
				}
			};
		}
		case Actions.CLOSE_PAYMENT_DIALOG: {
			return {
				...state,
				paymentDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: action.payload
				}
			};
		}
		case Actions.GET_PAYMENT_OPTIONS: {
			return {
				...state,
				paymentOptions: action.payload
			};
		}
		case Actions.GET_PAYMENT_PRODIVDERS: {
			return {
				...state,
				paymentProviders: action.payload
			};
		}
		case Actions.RESET_PAYMENT_PRODIVDERS: {
			return {
				...state,
				paymentProviders: null
			};
		}
		case Actions.SET_COLLECTION_RESPONSE: {
			return {
				...state,
				paymentCollection: {
					loading: false,
					data: action.payload,
					success: true
				}
			};
		}
		case Actions.SET_COLLECTION_RESPONSE_ERR: {
			return {
				...state,
				paymentCollection: {
					loading: false,
					data: null,
					success: false
				}
			};
		}
		default:
			return state;
	}
};

export default paymentReducer;
