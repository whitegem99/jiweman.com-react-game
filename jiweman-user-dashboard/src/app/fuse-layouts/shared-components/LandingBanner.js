import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import React from 'react';

function LandingBanner() {
	return (
		<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
			<FuseAnimate animation="transition.expandIn">
				<Logo height={150} />
			</FuseAnimate>

			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<Typography variant="h2" color="inherit" className="font-light">
					Welcome to the Joga Bonito!
				</Typography>
			</FuseAnimate>

			<FuseAnimate delay={400}>
				<Typography variant="h5" color="inherit" className="max-w-512 mt-16">
					A real Money Skill based Player Vs Player Mobile Esport that will keep you up playing all night!
				</Typography>
			</FuseAnimate>
		</div>
	);
}

export default LandingBanner;
