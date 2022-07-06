import * as Actions from '../actions';

const initialState = {
	loading: true,
	data: null,
	prizeConfigData: [],
	prizeConfigDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
	appListData: []
};

const playersReducers = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_SETTINGS:
			return {
				...state,
				loading: false,
				data: action.payload
			};
		case Actions.GET_PRIZE_CONFIG:
			return {
				...state,
				loading: false,
				prizeConfigData: action.payload
			};
		case Actions.GET_APP_LIST:
			return {
				...state,
				loading: false,
				appListData: action.payload
			};
		case Actions.OPEN_NEW_PRIZE_CONFIG_DIALOG: {
			return {
				...state,
				prizeConfigDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: null
				}
			};
		}
		case Actions.CLOSE_NEW_PRIZE_CONFIG_DIALOG: {
			return {
				...state,
				prizeConfigDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: null
				}
			};
		}
		case Actions.OPEN_EDIT_PRIZE_CONFIG_DIALOG: {
			return {
				...state,
				prizeConfigDialog: {
					type: 'edit',
					props: {
						open: true
					},
					data: action.data
				}
			};
		}
		case Actions.CLOSE_EDIT_PRIZE_CONFIG_DIALOG: {
			return {
				...state,
				prizeConfigDialog: {
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
