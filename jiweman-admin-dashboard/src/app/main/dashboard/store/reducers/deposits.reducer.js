    import * as Actions from '../actions/deposits.actions';

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

const deposits = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.DEPOSITS_SUCCESS:
            return {
                ...state,
                data: { ...actions.payload }
            };
        
        case Actions.UPDATE_DEPOSITS_DATE:
            return {
                ...state,
                dialog: { ...state.dialog, data: actions.payload}
            }
        
        default:
            return state;
    }
}

export default deposits