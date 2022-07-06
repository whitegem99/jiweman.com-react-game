import * as Actions from '../actions';

const initialState = {
	success: false
	// error: {
	// 	username: null,
	// 	password: null
	// }
};

const reset = (state = initialState, action) => {
	switch (action.type) {
		case Actions.RESET_SUCCESS: {
			return {
				...initialState,
				success: true
			};
		}
		case Actions.RESET_ERROR: {
			return {
				success: false
				// error: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default reset;
