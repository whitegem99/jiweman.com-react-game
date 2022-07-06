import { combineReducers } from 'redux';
import league from './league.reducer';
import processLeague from './processLeague.reducer';
import settings from '../../../settings/store/reducers/settings.reducer';

const reducer = combineReducers({
	league,
	processLeague,
	settings
});

export default reducer;
