import * as Actions from '../actions';

const initialState = {
	loading: true,
	walletHistory: null,
	walletBalance: null,
	withdrawWalletBalance: null,
	walletCurrency: null,
	paymentDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
	transferDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_WALLET_HISTORY:
			return {
				...state,
				loading: false,
				walletHistory: action.payload
			};

		case Actions.GET_WALLET_BALANCE:
			return {
				...state,
				walletBalance: action.payload.balance,
				withdrawWalletBalance: action.payload.withdrawableBalance,
				walletCurrency: action.payload.currency
			};

		case Actions.OPEN_PAYMENT_DIALOG_WALLET: {
			return {
				...state,
				paymentDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: action.payload
				}
			};
		}
		case Actions.CLOSE_PAYMENT_DIALOG_WALLET: {
			return {
				...state,
				paymentDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: action.payload
				}
			};
		}
		case Actions.OPEN_TRANSFER_DIALOG: {
			return {
				...state,
				transferDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: action.payload
				}
			};
		}
		case Actions.CLOSE_TRANSFER_DIALOG: {
			return {
				...state,
				transferDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: action.payload
				}
			};
		}

		default:
			return state;
	}
};

export default reducer;
