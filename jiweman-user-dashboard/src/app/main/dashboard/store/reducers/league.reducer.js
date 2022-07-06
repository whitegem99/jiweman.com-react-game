import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null,
	oneOnOneData: [],
	leagueDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
	prizePanel: {
		state: false,
		leagueData: null
	}
};

const leagueReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_LEAGUE:
			return {
				...state,
				loading: false,
				data: action.payload
			};

		case Actions.GET_ONEONONE:
			return {
				...state,
				loading: false,
				oneOnOneData: action.payload
			};
		case Actions.TOGGLE_PRIZE_PANEL_OPEN: {
			return {
				...state,
				prizePanel: {
					state: true,
					leagueData: action.payload
				}
			};
		}
		case Actions.TOGGLE_PRIZE_PANEL_CLOSE: {
			return {
				...state,
				prizePanel: {
					...initialState.prizePanel
				}
			};
		}
		default:
			return state;
	}
};

export default leagueReducers;
