import React from 'react';

const Config = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/payouts',
			component: React.lazy(() => import('./Payouts'))
		}
	]
};

export default Config;
