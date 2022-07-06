import React from 'react';

const FeedbackConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/feedback',
			component: React.lazy(() => import('./feedback'))
		}
	]
};

export default FeedbackConfig;
