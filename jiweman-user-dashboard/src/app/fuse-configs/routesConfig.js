import FuseUtils from '@fuse/utils';
import DashboardConfig from 'app/main/dashboard/DashboardConfig';
import DownloadConfig from 'app/main/download/DownloadConfig';
import ForgotPasswordConfig from 'app/main/forgot-password/ForgotPasswordConfig';
import ForgotUsernameConfig from 'app/main/forgot-username/ForgotUsernameConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import ResetPasswordConfig from 'app/main/reset-password/ResetPasswordConfig';
import TermsConditionsConfig from 'app/main/tnc/TncConfig';
import TransactionHistoryConfig from 'app/main/transaction-history/TransactionHistoryConfig';
import FeedbackConfig from 'app/main/feedback/FeedbackConfig';
import ReferalConfig from 'app/main/referal/ReferalConfig';
import UnavailableConfig from 'app/main/unavailable/UnavailableConfig';
import WalletConfig from 'app/main/wallet/WalletConfig';
import WinningsConfig from 'app/main/winnings/WinningsConfig';
import React from 'react';
import { Redirect } from 'react-router-dom';
import HomepageConfig from 'app/main/homepage/HomepageConfig';

const routeConfigs = [
	LoginConfig,
	DashboardConfig,
	DownloadConfig,
	RegisterConfig,
	ForgotPasswordConfig,
	ResetPasswordConfig,
	ForgotUsernameConfig,
	WinningsConfig,
	TransactionHistoryConfig,
	UnavailableConfig,
	TermsConditionsConfig,
	WalletConfig,
	FeedbackConfig,
	ReferalConfig,
	HomepageConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['player']),
	{
		path: '/',
		component: () => <Redirect to="/dashboard" />
	}
];

export default routes;
