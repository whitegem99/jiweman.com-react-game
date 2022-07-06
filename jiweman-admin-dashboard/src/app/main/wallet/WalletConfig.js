import React from 'react';

const WalletConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/wallet/',
			component: React.lazy(() => import('./Wallet'))
		}
	]
};

export default WalletConfig;
