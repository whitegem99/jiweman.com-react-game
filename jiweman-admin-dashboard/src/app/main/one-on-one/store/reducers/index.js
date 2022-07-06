import { combineReducers } from 'redux';
import league from './league.reducer';

const reducer = combineReducers({
	game: league
});

export default reducer;
