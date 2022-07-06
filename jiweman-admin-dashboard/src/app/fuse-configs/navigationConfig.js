import { authRoles } from "app/auth";

const navigationConfig = [
	{
		id: 'dashboard-component',
		title: 'Dashboard',
		type: 'item',
		icon: 'dashboard',
		url: '/dashboard'
	},
	{
		id: 'players-component',
		title: 'Players',
		type: 'item',
		icon: 'contacts',
		url: '/players'
	},
	{
		id: 'league-component',
		title: 'League',
		type: 'item',
		icon: 'opacity',
		url: '/league'
	},
	{
		id: 'ono-component',
		title: 'One On One',
		type: 'item',
		icon: 'opacity',
		url: '/oneonone'
	},
	{
		id: 'leaderboard-component',
		title: 'Leaderboard',
		type: 'item',
		icon: 'format_list_numbered',
		url: '/leaderboard'
	},
	{
		id: 'game-settings-component',
		title: 'Settings',
		type: 'item',
		icon: 'build',
		url: '/settings',
		auth: authRoles.onlySuperAdmin
	},
	{
		id: 'tran-settings-component',
		title: 'Transactions',
		type: 'item',
		icon: 'attach_money',
		url: '/wallet'
	},
	{
		id: 'payout-settings-component',
		title: 'Payouts',
		type: 'item',
		icon: 'payment',
		url: '/payouts'
	},
	{
		id: 'verification-settings-component',
		title: 'Verifications',
		type: 'item',
		icon: 'verified_user',
		url: '/verifications'
	},
	{
		id: 'feedback-component',
		title: 'Feedback',
		type: 'item',
		icon: 'feedback',
		url: '/feedback'
	},
	{
		id: 'bettingCompanies-component',
		title: 'Betting Companies',
		type: 'item',
		icon: 'work',
		url: '/bettingCompanies',
		auth: authRoles.onlySuperAdmin
	}
];

export default navigationConfig;
