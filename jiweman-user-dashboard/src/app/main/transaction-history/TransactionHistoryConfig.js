import React from 'react';

const TransactionHistoryConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/transactions',
			component: React.lazy(() => import('./TransactionHistory'))
		}
	]
};

export default TransactionHistoryConfig;
