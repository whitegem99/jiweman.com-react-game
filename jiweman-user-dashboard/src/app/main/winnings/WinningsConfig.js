import React from 'react';

const WinningsConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/winnings',
			component: React.lazy(() => import('./Winnings'))
		}
	]
};

export default WinningsConfig;
