import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	// title: {
	// 	fontSize: 24
	// },
	// toolbar: {
	// 	justifyContent: 'space-between'
	// },
	left: {
		flex: 1
	},
	// leftLinkActive: {
	// 	color: theme.palette.common.white
	// },
	right: {
		flex: 1,
		display: 'flex',
		justifyContent: 'space-evenly'
	}
	// rightLink: {
	// 	fontSize: 16,
	// 	color: theme.palette.common.white,
	// 	marginLeft: theme.spacing(3)
	// },
	// linkSecondary: {
	// 	color: theme.palette.secondary.main
	// }
});

function AppAppBar(props) {
	const { classes } = props;

	return (
		<div className={classes.root}>
			<AppBar position="sticky" color="transparent" style={{ position: 'fixed' }}>
				<Toolbar>
					{/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						News
					</Typography> */}
					<div className={classes.left}></div>
					<div className={classes.right} classes="flex ">
						<Button color="inherit">About</Button>
						<Button color="inherit">Features</Button>
						<Button
							color="inherit"
							component={Link}
							onClick={() => {
								window.open(
									'https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users',
									'_blank'
								);
							}}
						>
							Download Now
						</Button>
						<Button to="./login" color="inherit" className="login-button" component={Link}>
							Log In &nbsp; {'>'}
						</Button>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}

AppAppBar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppAppBar);
