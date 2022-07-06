import { combineReducers } from 'redux';
import widgets from './widgets.reducer';
import transactions from './transactions.reducer';
import filters from './filter.reducer';
import deposits from './deposits.reducer';
import withdrawals from './withdrawal.reducer';

const reducer = combineReducers({
	widgets,
	transactions,
	filters,
	deposits,
	withdrawals
});

export default reducer;
