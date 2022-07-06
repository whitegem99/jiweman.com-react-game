import FuseAnimate from '@fuse/core/FuseAnimate';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';

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

function Download() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-96 md:items-center md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<Logo height={150} />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h3" color="inherit" className="font-light">
						Welcome to the Joga Bonito!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
						A real Money Skill based Player Vs Player Mobile Esport that will keep you up playing all night!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<div className="pt-64 flex flex-row space-between items-center">
						<img
							style={{ height: '350px' }}
							src="https://jiweman.com/assets/images/mobile.png"
							alt="mobile-game"
						></img>

						<div className="flex flex-col flex-1 pl-136">
							<Button
								component={Link}
								to="/login"
								variant="contained"
								color="secondary"
								className="self-center mb-36"
							>
								<Typography variant="h4" color="inherit" className="text-center font-bold">
									Login
								</Typography>
							</Button>
							<Button
								onClick={() => {
									window.open('https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users', '_blank');
								}}
								disableRipple={true}
								variant="contained"
								color="secondary"
								className="self-center"
								style={{ textDecoration: 'none' }}
							>
								<Typography variant="h4" color="inherit" className="text-center font-bold">
									Download
								</Typography>
							</Button>
						</div>
					</div>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default Download;
