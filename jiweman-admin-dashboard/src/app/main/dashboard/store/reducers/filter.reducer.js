import * as Actions from '../actions/filter.actions';

const initialState = {
    data: [],
    playersList: [],
}

const filters = (state = initialState, actions) => {
    switch (actions.type) {
        case Actions.FETCH_COMPANIES:
            return {
                ...state,
                data: actions.payload
            };
        
        case Actions.FETCH_COMPANY_PLAYER_LIST:
            return {
                ...state,
                playersList: actions.payload,
            }
        
        default:
            return state;
    }
}

export default filters;