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
import ResetForm from './tabs/ResetForm';

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

function ResetPassword() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<LandingBanner></LandingBanner>
			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-160 ">
						<Typography variant="h6" className="text-center md:w-full mb-48">
							Reset you password
						</Typography>

						<ResetForm />

						<Button
							variant="contained"
							color="secondary"
							className="w-full mx-auto mt-16 normal-case mb-16 "
							aria-label="Resiter"
							value="legacy"
							component={Link}
							to="/login"
						>
							Login
						</Button>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default ResetPassword;
