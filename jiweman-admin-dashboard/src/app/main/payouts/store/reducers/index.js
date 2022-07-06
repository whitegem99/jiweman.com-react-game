import { combineReducers } from 'redux';
import payouts from './payouts.reducer';

const reducer = combineReducers({
	payouts
});

export default reducer;
