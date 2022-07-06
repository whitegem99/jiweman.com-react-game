const navigationConfig = [
	{
		id: 'dashboard-component',
		title: 'Dashboard',
		type: 'item',
		icon: 'dashboard',
		url: '/dashboard'
	},
	{
		id: 'winnings-component',
		title: 'My Winnings',
		type: 'item',
		icon: 'stars',
		url: '/winnings'
	},
	{
		id: 'wallet-component',
		title: 'My Wallet',
		type: 'item',
		icon: 'attach_money',
		url: '/wallet'
	},
	{
		id: 'transactions-component',
		title: 'My Transactions',
		type: 'item',
		icon: 'directions_transit',
		url: '/transactions'
	},
	{
		id: 'download-link',
		title: 'Download Game',
		type: 'link',
		icon: 'get_app',
		// url: 'https://install.appcenter.ms/users/fastskill/apps/joga-bonito/distribution_groups/public',
		url: 'https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users',
		target: '_blank'
	},
	{
		id: 'tnc-link',
		title: 'Terms & Conditions',
		type: 'link',
		icon: 'gavel',
		url: './terms-n-conditions',
		target: '_blank'
	},
	{
		id: 'feedback-component',
		title: 'Feedback',
		type: 'item',
		icon: 'feedback',
		url: '/feedback'
	},
	{
		id: 'feedback-component',
		title: 'Referal',
		type: 'item',
		icon: 'insert_invitation',
		url: '/referal'
	}
];

export default navigationConfig;
