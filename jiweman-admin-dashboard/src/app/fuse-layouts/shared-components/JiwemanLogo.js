import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		'& .logo-icon': {
			// width: 24,
			// height: 24,
			transition: theme.transitions.create(['width', 'height'], {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		},
		'& .react-badge, & .logo-text': {
			transition: theme.transitions.create('opacity', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		}
	},
	reactBadge: {
		backgroundColor: '#121212',
		color: '#61DAFB'
	}
}));

function JiwemanLogo(props) {
	const classes = useStyles();
	const { height = 55 } = props;
	return (
		<div className={clsx(classes.root, 'flex items-center')}>
			<img className="logo-icon" src="assets/images/logos/JiwemanLogo.png" style={{ height }} alt="logo" />
		</div>
	);
}

export default JiwemanLogo;
