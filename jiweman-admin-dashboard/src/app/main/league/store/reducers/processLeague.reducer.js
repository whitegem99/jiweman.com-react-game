import * as Actions from '../actions';

const initialState = {
	state: false,
	data: null,
	leagueData: null,
	winners: {
		loading: true,
		data: null
	},
	processedWinnerSuccess: false
};

const processLeague = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_LEAGUE_PANEL_DATA: {
			return {
				...state,
				winners: {
					loading: false,
					data: action.payload
				}
			};
		}
		case Actions.TOGGLE_PROCESS_LEAGUE_PANEL_OPEN: {
			return {
				...state,
				state: true,
				leagueData: action.payload
			};
		}
		case Actions.TOGGLE_PROCESS_LEAGUE_PANEL_CLOSE: {
			return {
				...state,
				state: false,
				leagueData: null,
				winners: {
					loading: true,
					data: null
				},
				processedWinnerSuccess: false
			};
		}
		case Actions.PROCESS_WINNERS_SUCCESSFUL: {
			return {
				...state,
				processedWinnerSuccess: true
			};
		}
		default: {
			return state;
		}
	}
};

export default processLeague;
