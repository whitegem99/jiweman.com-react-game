import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null
};

const playersReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_TRANSACTIONS:
			return {
				loading: false,
				data: action.payload
			};
		default:
			return state;
	}
};

export default playersReducers;
