const Deployer = require('ssh-deploy-release');

const options = {
	localPath: './build/',
	host: process.env['SSH' + '_HOST'],
	username: process.env['SSH' + '_USER'],
	password: process.env['SSH' + '_PASS'],
	deployPath: '/root/jiweman-node-game-server-2020/server/master/'
};

const deployer = new Deployer(options);
deployer.deployRelease(() => {
	console.log('Ok !');
});
