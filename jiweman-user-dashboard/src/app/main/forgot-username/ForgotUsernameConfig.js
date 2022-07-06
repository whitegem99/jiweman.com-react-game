import { authRoles } from 'app/auth';
import React from 'react';

const ForgotUsernameConfig = {
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
			path: '/forgot-username',
			component: React.lazy(() => import('./ForgotUsername'))
		}
	]
};

export default ForgotUsernameConfig;
