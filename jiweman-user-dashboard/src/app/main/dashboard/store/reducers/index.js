import { combineReducers } from 'redux';
import league from './league.reducer';
import payment from './payment.reducer';
import wallet from '../../../wallet/store/reducers/wallet.reducer';
// import league from '../../../league/store/reducers'

const reducer = combineReducers({
	league,
	payment,
	wallet
});

export default reducer;
