import React from 'react';

const DashboardConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/players',
			component: React.lazy(() => import('./Players'))
		}
	]
};

export default DashboardConfig;
