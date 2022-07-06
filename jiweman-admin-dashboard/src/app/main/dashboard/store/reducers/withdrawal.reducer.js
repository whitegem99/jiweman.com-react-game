import * as Actions from '../actions/withdrawal.actions';

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

const withdrawal = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.WITHDRAWAL_SUCCESS:
            return {
                ...state,
                data: { ...actions.payload }
            };
        
        case Actions.UPDATE_WITHDRAWAL_DATE:
            return {
                ...state,
                dialog: { ...state.dialog, data: actions.payload}
            }
        
        default:
            return state;
    }
}

export default withdrawal