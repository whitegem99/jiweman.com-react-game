import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null,
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

const playersReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_LEAGUE:
			return {
				...state,
				loading: false,
				data: action.payload
			};

		case Actions.OPEN_NEW_LEAGUE_DIALOG: {
			return {
				...state,
				leagueDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: null
				}
			};
		}
		case Actions.CLOSE_NEW_LEAGUE_DIALOG: {
			return {
				...state,
				leagueDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: null
				}
			};
		}
		case Actions.OPEN_EDIT_LEAGUE_DIALOG: {
			return {
				...state,
				leagueDialog: {
					type: 'edit',
					props: {
						open: true
					},
					data: action.data
				}
			};
		}
		case Actions.CLOSE_EDIT_LEAGUE_DIALOG: {
			return {
				...state,
				leagueDialog: {
					type: 'edit',
					props: {
						open: false
					},
					data: null
				}
			};
		}
		case Actions.TOGGLE_PRIZE_LIST_PANEL_OPEN: {
			return {
				...state,
				prizePanel: {
					state: true,
					leagueData: action.payload
				}
			};
		}
		case Actions.TOGGLE_PRIZE_LIST_PANEL_CLOSE: {
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

export default playersReducers;
