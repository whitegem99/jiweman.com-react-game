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
	}
};

const playersReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_GAME:
			return {
				...state,
				loading: false,
				data: action.payload
			};

			case Actions.OPEN_NEW_GAME_DIALOG: {
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
			case Actions.CLOSE_NEW_GAME_DIALOG: {
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
			case Actions.OPEN_EDIT_GAME_DIALOG: {
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
			case Actions.CLOSE_EDIT_GAME_DIALOG: {
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
		default:
			return state;
	}
};

export default playersReducers;
