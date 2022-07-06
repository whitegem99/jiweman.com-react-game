import { authRoles } from 'app/auth';
import TermsConditions from './Tnc';

const TermsConditionsConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: null,
	routes: [
		{
			path: '/terms-n-conditions',
			component: TermsConditions
		}
	]
};

export default TermsConditionsConfig;
