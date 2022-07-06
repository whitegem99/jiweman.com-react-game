import FuseAnimate from '@fuse/core/FuseAnimate';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import LandingBanner from 'app/fuse-layouts/shared-components/LandingBanner';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import ForgotForm from './tabs/ForgotForm';

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

function ForgotPassword() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 md:flex-row md:p-0')}>
			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className={clsx(classes.card, 'w-full max-w-400 m-40 self-center')} square={false}>
					<CardContent className="flex flex-col  items-center justify-center p-32 md:p-48">
						<Typography variant="h6" className="text-center md:w-full mb-48">
							Forgot your username?
						</Typography>

						<ForgotForm />

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16 normal-case mb-16 blue-ios-button "
							aria-label="Resiter"
							value="legacy"
							component={Link}
							to="/login"
						>
							Login
						</Button>

						{/* <div className="flex flex-col items-center justify-center ">
							<span className="font-medium">Forgot your password?</span>
							<Link className="font-medium" to="/forgot-password">
								Click here
							</Link>
						</div> */}
					</CardContent>
				</Card>
			</FuseAnimate>
			<LandingBanner></LandingBanner>
		</div>
	);
}

export default ForgotPassword;
