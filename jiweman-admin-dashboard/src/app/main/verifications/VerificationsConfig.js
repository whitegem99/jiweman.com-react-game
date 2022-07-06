import React from 'react';

const Config = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/verifications',
			component: React.lazy(() => import('./Verifications'))
		}
	]
};

export default Config;
