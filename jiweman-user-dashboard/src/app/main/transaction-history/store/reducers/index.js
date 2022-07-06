import { combineReducers } from 'redux';
import transactions from './transactions.reducer';

const reducer = combineReducers({
	transactions
});

export default reducer;
