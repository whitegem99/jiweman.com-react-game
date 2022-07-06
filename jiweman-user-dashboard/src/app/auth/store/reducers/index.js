import { combineReducers } from 'redux';
import login from './login.reducer';
import register from './register.reducer';
import user from './user.reducer';
import reset from './reset.reducer';

const authReducers = combineReducers({
	user,
	login,
	register,
	reset
});

export default authReducers;
