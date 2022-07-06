import React from 'react';

const OneOnOneConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/oneonone',
			component: React.lazy(() => import('./OneOnOne'))
		}
	]
};

export default OneOnOneConfig;
