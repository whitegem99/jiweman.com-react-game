import FuseAnimate from '@fuse/core/FuseAnimate';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import LandingBanner from 'app/fuse-layouts/shared-components/LandingBanner';
import clsx from 'clsx';
import qs from 'qs';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import { Link } from 'react-router-dom';
import JWTLoginTab from './tabs/JWTLoginTab';

const useStyles = makeStyles(theme => ({
	root: {
		background: 'linear-gradient(247.54deg, #FF6A00 2.56%, #EE0979 113.22%)',
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
	const dispatch = useDispatch();
	const location = useLocation();
	const { new_account } = qs.parse(location.search, { ignoreQueryPrefix: true });

	useEffect(() => {
		if (new_account) {
			dispatch(
				MessageActions.showMessage({
					message: 'Account verified Successfully..You can login now', //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'right' //left center right
					},
					variant: 'success' //success error info warning null
				})
			);
		}
	}, [dispatch, new_account]);

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 md:flex-row md:p-0 items-center')}>
			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className={clsx(classes.card, 'w-full max-w-400 m-40')} square={false}>
					<CardContent className="flex flex-col items-center justify-center login-card md:p-48">
						<Typography className="text-center md:w-full mb-12 login-title">
							Log In Your Account
						</Typography>
						<Typography className="text-center font-300 md:w-full login-sub-title">
							Already registered on the app?
							<br />
							Use the same credentials.
						</Typography>

						<JWTLoginTab />

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto normal-case blue-ios-button"
							aria-label="Resiter"
							value="legacy"
							component={Link}
							to="/register"
						>
							Register
						</Button>

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto normal-case blue-ios-button"
							aria-label="Resiter"
							value="legacy"
							component={Link}
							onClick={() => {
								window.open(
									'https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users',
									'_blank'
								);
							}}
						>
							Download Game
						</Button>

						<div className="flex flex-col items-center justify-center click-here-section">
							<span className="font-medium">Forgot your password?</span>
							<Link className="font-medium" to="/forgot-password">
								Click here
							</Link>
						</div>
						<div className="flex flex-col items-center justify-center mt-12 click-here-section">
							<span className="font-medium">Lost your username?</span>
							<Link className="font-medium" to="/forgot-username">
								Retrieve
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
			<LandingBanner />
		</div>
	);
}

export default Login;
