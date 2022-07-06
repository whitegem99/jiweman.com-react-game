import React from 'react';
import { authRoles } from 'app/auth';

const Config = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.onlySuperAdmin,
	routes: [
		{
			path: '/bettingCompanies',
			component: React.lazy(() => import('./BettingCompanies'))
		}
	]
};

export default Config;
