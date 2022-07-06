import { authRoles } from 'app/auth';
import Unavailable from './Unavailable';

const UnavailableConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/unavailable',
			component: Unavailable
		}
	]
};

export default UnavailableConfig;
