import { combineReducers } from 'redux';
import winnings from './winnings.reducer';
// import payment from './payment.reducer';
// import league from '../../../league/store/reducers'

const reducer = combineReducers({
	winnings
	// payment
});

export default reducer;
