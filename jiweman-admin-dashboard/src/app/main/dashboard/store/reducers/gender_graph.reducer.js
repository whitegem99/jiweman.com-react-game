import * as Actions from '../actions/gender_graph.actions';

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

const ageGraph = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.GENDER_GRAPH_SUCCESS:
            return {
                ...state,
                data: { ...actions.payload }
            };
        
        case Actions.UPDATE_GENDER_DATE:
            return {
                ...state,
                dialog: { ...state.dialog, data: actions.payload}
            }
        
        default:
            return state;
    }
}

export default ageGraph