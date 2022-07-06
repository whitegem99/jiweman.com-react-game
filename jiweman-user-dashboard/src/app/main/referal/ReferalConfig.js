import React from 'react';

const ReferalConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/referal',
			component: React.lazy(() => import('./Referal'))
		}
	]
};

export default ReferalConfig;
