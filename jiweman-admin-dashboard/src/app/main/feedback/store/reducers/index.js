import { combineReducers } from 'redux';
import feedbacks from './feedback.reducer';

const reducer = combineReducers({
	feedbacks
});

export default reducer;
