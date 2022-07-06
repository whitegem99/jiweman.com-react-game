import * as Actions from '../actions';

const initialState = {
	success: true,
	companies: {data: [{_id:"test", name:"test"}]},
	error: {
		username: null,
		password: null
	}
};

const register = (state = initialState, action) => {
	switch (action.type) {
		case Actions.REGISTER_SUCCESS: {
			return {
				...initialState,
				success: true
			};
		}
		case Actions.REGISTER_ERROR: {
			return {
				success: false,
				error: action.payload
			};
		}
		case 'RESET_STATE': {
			return {
				...initialState
			};
		}
		case Actions.GET_BETTING_COMPANIES:
			return {
				...initialState,
				loading: false,
				companies: action.payload
			};
		default: {
			return state;
		}
	}
};

export default register;
