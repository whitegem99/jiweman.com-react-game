import { authRoles } from 'app/auth';
import React from 'react';

const ResetPasswordConfig = {
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
			path: '/reset-password',
			component: React.lazy(() => import('./ResetPassword'))
		}
	]
};

export default ResetPasswordConfig;
