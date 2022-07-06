import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import JWTLoginTab from './tabs/JWTLoginTab';
import { Button } from '@material-ui/core';

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

function Login() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 md:flex-row md:p-0 items-center')}>
			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className={clsx(classes.card, 'w-full max-w-400 m-40 self-center')} square={false}>
					<CardContent className="flex flex-col items-center justify-center login-card md:p-48">
						<Typography className="text-center md:w-full mb-12 login-title">
							Log In Your Account
						</Typography>

						<JWTLoginTab />

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16 normal-case mb-16 blue-ios-button"
							aria-label="Resiter"
							value="legacy"
							component={Link}
							to="/register"
						>
							Register as betting compnay
						</Button>

						<div className="flex flex-col items-center justify-center click-here-section">
							<span className="font-medium">Forgot your password?</span>
							<Link className="font-medium" to="/forgot-password">
								Click here
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>

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
		</div>
	);
}

export default Login;
