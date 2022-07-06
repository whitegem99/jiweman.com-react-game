import { authRoles } from 'app/auth';
import Download from './Download';

const DownloadConfig = {
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
			path: '/download',
			component: Download
		}
	]
};

export default DownloadConfig;
