import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null
};

const widgetsReducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_WIDGETS:
			return {
				loading: false,
				data: {...action.payload}
			};
		default:
			return state;
	}
};

export default widgetsReducer;
