import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import DashboardConfig from 'app/main/dashboard/DashboardConfig';
import PlayersConfig from 'app/main/players/PlayersConfig';
import SettingsConfig from 'app/main/settings/SettingsConfig';
import LeagueConfig from 'app/main/league/LeagueConfig';
import LeaderboardConfig from 'app/main/leaderboard/LeaderboardConfig';
import TransactionsConfig from 'app/main/transactions/TransactionsConfig';
import PayoutsConfig from 'app/main/payouts/PayoutsConfig';
import OneOnOneConfig from 'app/main/one-on-one/OneOnOneConfig';
import WalletConfig from 'app/main/wallet/WalletConfig';
import VerificationsConfig from 'app/main/verifications/VerificationsConfig';
import FeedbackConfig from 'app/main/feedback/FeedbackConfig';
import Register from 'app/main/register/RegisterConfig';
import bettingCompanies from 'app/main/bettingCompanies/BettingCompaniesConfig';
import { authRoles } from 'app/auth';
import HomepageConfig from 'app/main/homepage/HomepageConfig';

const routeConfigs = [
	LoginConfig,
	ExampleConfig,
	DashboardConfig,
	PlayersConfig,
	SettingsConfig,
	LeagueConfig,
	LeaderboardConfig,
	TransactionsConfig,
	PayoutsConfig,
	OneOnOneConfig,
	WalletConfig,
	VerificationsConfig,
	FeedbackConfig,
	Register,
	bettingCompanies,
	HomepageConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, authRoles.admin),
	{
		path: '/',
		component: () => <Redirect to="/dashboard" />
	}
];

export default routes;
