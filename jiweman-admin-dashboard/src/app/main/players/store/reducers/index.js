import { combineReducers } from 'redux';
import players from './players.reducer';

const reducer = combineReducers({
	players
});

export default reducer;
