import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: [],
	leagueLoading: true,
	leagueData: [],
};

const leaderboardReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_LEADERBOARD:
			return {
				...state,
				loading: false,
				data: action.payload
			};
		case Actions.RESET_LEADERBOARD:
			return {
				...state,
				loading: false,
				data: action.payload
			};
		case Actions.GET_LEADERBOARD_LEAGUE:
			return {
				...state,
				leagueLoading: false,
				leagueData: action.payload
			};
		default:
			return state;
	}
};

export default leaderboardReducers;
