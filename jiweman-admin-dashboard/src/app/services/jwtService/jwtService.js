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
						this.emit('onAutoLogout', 'Invalid access_token');
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
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/bettingCompany/register', data).then(response => {
				if (response.data.status) {
					resolve(response.data);
				} else {
					reject(response.data);
				}
			}).catch(err => {
				reject(err.response.data);
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post('/login', {
					loginType: 'adminLogin',
					userName: email,
					password
				})
				.then(response => {
					if (response.data.data) {
						this.setSession(response.data.token);
						this.setUserData(response.data.data);
						resolve(response.data.data);
					} else {
						reject(response.data.error);
					}
				}).catch(err => {
					reject(err.response.data);
				})
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
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	setUserData = user => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
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
		return window.localStorage.getItem('jwt_access_token');
	};
	getUserData = () => {
		return JSON.parse(window.localStorage.getItem('user'));
	};
}

const instance = new JwtService();

export default instance;
