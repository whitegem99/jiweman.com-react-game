import React from 'react';

const LeagueConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/league',
			component: React.lazy(() => import('./League'))
		}
	]
};

export default LeagueConfig;
