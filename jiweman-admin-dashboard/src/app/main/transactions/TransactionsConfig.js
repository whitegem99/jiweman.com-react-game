import React from 'react';

const Config = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/transactions',
			component: React.lazy(() => import('./Transactions'))
		}
	]
};

export default Config;
