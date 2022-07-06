import * as Actions from '../actions/country_graph.actions';

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

const countryGraph = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.COUNTRY_GRAPH_SUCCESS:
            return {
                ...state,
                data: { ...actions.payload }
            };
        
        case Actions.UPDATE_COUNTRY_DATE:
            return {
                ...state,
                dialog: { ...state.dialog, data: actions.payload}
            }
        
        default:
            return state;
    }
}

export default countryGraph