import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null,
	feedbackDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
	messagePanel: {
		state: false,
		messageData: null
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_FEEDBACKS:
			return {
				...state,
				loading: false,
				data: action.payload
			};
		case Actions.OPEN_FEEDBACK_DIALOG: {
			return {
				...state,
				feedbackDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: action.payload
				}
			};
		}
		case Actions.CLOSE_FEEDBACK_DIALOG: {
			return {
				...state,
				feedbackDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: action.payload
				}
			};
		}
		case Actions.TOGGLE_MESSAGE_LIST_PANEL_OPEN: {
			return {
				...state,
				messagePanel: {
					state: true,
					messageData: action.payload
				}
			};
		}
		case Actions.TOGGLE_MESSAGE_LIST_PANEL_CLOSE: {
			return {
				...state,
				messagePanel: {
					...initialState.messagePanel
				}
			};
		}

		default:
			return state;
	}
};

export default reducer;
