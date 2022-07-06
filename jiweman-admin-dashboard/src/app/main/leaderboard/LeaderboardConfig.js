import React from 'react';

const LeaderboardConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/leaderboard',
			component: React.lazy(() => import('./Leaderboard'))
		}
	]
};

export default LeaderboardConfig
