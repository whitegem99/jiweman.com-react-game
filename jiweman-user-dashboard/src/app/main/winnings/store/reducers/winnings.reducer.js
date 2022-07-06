import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null,
	winningDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	}
};

const winningsReducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_WINNINGS: {
			return {
				...state,
				loading: false,
				data: action.payload
			};
		}
		case Actions.OPEN_WINNINGS_DIALOG: {
			return {
				...state,
				winningDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: action.payload
				}
			};
		}
		case Actions.CLOSE_WINNINGS_DIALOG: {
			return {
				...state,
				winningDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: action.payload
				}
			};
		}
		default:
			return state;
	}
};

export default winningsReducer;
