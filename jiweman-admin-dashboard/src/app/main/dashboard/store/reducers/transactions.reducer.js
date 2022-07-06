import * as Actions from '../actions/transactions.actions';

const initialState = {
    data: null,
    dialog: {
        data: {
            startDate: Actions.DefaultParams.startDate,
            endDate: Actions.DefaultParams.endDate,
            type: Actions.DefaultParams.type
        }
    }
}

const transactions = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.TRANSATIONS_SUCCESS:
            return {
                ...state,
                data: { ...actions.payload }
            };
        
        case Actions.UPDATE_TRANSACTIONS_DATE:
            return {
                ...state,
                dialog: { ...state.dialog, data: actions.payload}
            }
        
        default:
            return state;
    }
}

export default transactions