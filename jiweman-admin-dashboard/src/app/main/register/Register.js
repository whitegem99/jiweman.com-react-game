import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
// import LandingBanner from 'app/fuse-layouts/shared-components/LandingBanner';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import JWTRegisterTab from './tabs/JWTRegisterTab';
import { Button } from '@material-ui/core';
import Logo from 'app/fuse-layouts/shared-components/Logo';

const useStyles = makeStyles(theme => ({
	root: {
		background: 'linear-gradient(247.54deg, #870846 0.63%, #EE0979 113.22%)',
		color: theme.palette.primary.contrastText,

		// backgroundImage: 'url("./assets/images/backgrounds/football-bg.webp")',
		// backgroundColor: '#FAFAFA',
		backgroundSize: 'auto',
		backgroundPosition: 'bottom',
		backgroundRepeat: 'no-repeat'
		// Filter: `blur(100px)`
		// backgroundColor: '#FAFAFA',
	},
	card: {
		background: 'rgba(255, 255, 255, 0.65)',

		/* Note: backdrop-filter has minimal browser support */

		borderRadius: '35px'
	}
}));

function Register() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 md:flex-row md:p-0 items-center')}>
			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className={clsx(classes.card, 'w-full max-w-400 m-40 self-center')} square={false}>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48">
						<Typography variant="h3" className="text-center md:w-full mb-12">
							CREATE AN ACCOUNT
						</Typography>

						<Typography variant="subtitle1" className="text-center font-300 md:w-full mb-28">
							Once registered, download and continue on the app to play!
						</Typography>

						<JWTRegisterTab />

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16 normal-case mb-16 blue-ios-button"
							aria-label="Resiter"
							value="legacy"
							component={Link}
							onClick={() => {
								window.open(
									'https://install.appcenter.ms/users/fastskill/apps/joga-bonito/distribution_groups/public',
									'_blank'
								);
							}}
						>
							Download Game
						</Button>

						<div className="flex flex-col items-center justify-center pt-32 pb-24 text-20">
							<span className="font-medium">Already have an account?</span>
							<Link className="font-medium" to="/login">
								Login
							</Link>
							{/* <Link className="font-medium mt-8" to="/">
								Back to Dashboard
							</Link> */}
						</div>

						<div className="flex flex-col items-center" />
					</CardContent>
				</Card>
			</FuseAnimate>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<Logo height={200} />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h3" color="inherit" className="font-light">
						Welcome to the Joga Bonito!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
						Joga Bonito is for Football games lovers, Exciting and addictive style gameplay with great
						physics, Let the fun begin !
					</Typography>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default Register;
