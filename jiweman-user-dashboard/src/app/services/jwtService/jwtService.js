import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Session Expired. Login Again!');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}
		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'Session Expired. Login Again!');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/registerWithJieman', data)
				.then(response => {
					if (response.data.status) {
						// this.setSession(response.data.access_token);
						resolve(response.data);
					} else {
						reject(response.data);
					}
				})
				.catch(error => reject(error.response.data));
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/loginwithJiweman', {
					userName: email,
					password
				})
				.then(response => {
					if (response.data.data && response.data.status) {
						this.setSession(response.data.token);
						this.setUserData(response.data.data);
						resolve(response.data.data);
					}else if(response.data.status ===false){
						reject(response.data);
					} else {
						reject(response.data.error);
					}
				})
				.catch(error => reject(error.response.data));
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			// axios
			// 	.get('/api/auth/access-token', {
			// 		data: {
			// 			access_token: this.getAccessToken()
			// 		}
			// 	})
			// 	.then(response => {
			// 		if (response.data.user) {
			// 			this.setSession(response.data.access_token);
			// 			resolve(response.data.user);
			// 		} else {
			// 			this.logout();
			// 			Promise.reject(new Error('Failed to login with token.'));
			// 		}
			// 	})
			// 	.catch(error => {
			// 		this.logout();
			// 		Promise.reject(new Error('Failed to login with token.'));
			// 	});
			resolve(this.getUserData());
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token_player', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token_player');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	setUserData = user => {
		if (user) {
			localStorage.setItem('user_player', JSON.stringify(user));
		} else {
			localStorage.removeItem('user_player');
		}
	};

	logout = () => {
		this.setSession(null);
		this.setUserData(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		// const decoded = jwtDecode(access_token);
		// const currentTime = Date.now() / 1000;
		// if (decoded.exp < currentTime) {
		// 	console.warn('access token expired');
		// 	return false;
		// }

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token_player');
	};
	getUserData = () => {
		return JSON.parse(window.localStorage.getItem('user_player'));
	};

	forgotPassword = email => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/forgotpassword', {
					email
				})
				.then(response => {
					if (response.data.status) {
						resolve(response.data);
					} else {
						reject(response.data);
					}
				})
				.catch(error => reject(error.response.data));
		});
	};

	resetPassword = req => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/resetPassword?token=' + req.token, req)
				.then(response => {
					if (response.data.status === true) {
						resolve(response.data);
					} else {
						reject(response.data);
					}
				})
				.catch(error => reject(error.response.data));
		});
	};

	forgotUsername = req => {
		return new Promise((resolve, reject) => {
			axios
				.post('/auth/getUsername', req)
				.then(response => {
					if (response.data.status === true) {
						resolve(response.data);
					} else {
						reject(response.data);
					}
				})
				.catch(error => reject(error.response.data));
		});
	};
}

const instance = new JwtService();

export default instance;
