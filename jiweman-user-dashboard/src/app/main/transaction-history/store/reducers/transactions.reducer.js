import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_TRANSACTION_HISTORY:
			return {
				...state,
				loading: false,
				data: action.payload
			};

		default:
			return state;
	}
};

export default reducer;
