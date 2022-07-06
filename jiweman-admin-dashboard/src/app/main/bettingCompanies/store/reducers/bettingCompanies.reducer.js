import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null
};

const bettingCompaniesReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_BETTING_COMPANIES:
			return {
				loading: false,
				data: action.payload
			};
		case Actions.APPROVE_COMPANY:
			return {
				loading: false
			};
		default:
			return state;
	}
};

export default bettingCompaniesReducers;
