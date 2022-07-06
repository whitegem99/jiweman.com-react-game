import FuseAnimate from '@fuse/core/FuseAnimate';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText,
		backgroundImage: 'url("./assets/images/backgrounds/football-bg.webp")',
		// backgroundColor: '#FAFAFA',
		backgroundSize: 'auto',
		backgroundPosition: 'bottom',
		backgroundRepeat: 'no-repeat'
		// Filter: `blur(100px)`
		// backgroundColor: '#FAFAFA',
	}
}));

function Unavailable() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 flex-row p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center mb-256 md:items-center md:flex-shrink-0 md:flex-1 justify-center">
				<FuseAnimate animation="transition.expandIn">
					<Logo height={150} />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h4" color="inherit" className="font-light">
						Joga Bonito is not available in your country yet!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="h5" color="inherit" className="mt-16">
						Thank you for your interest. We'll expand soon globally.
					</Typography>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default Unavailable;
