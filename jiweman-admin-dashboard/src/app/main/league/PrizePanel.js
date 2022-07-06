import { AppBar, Button, Divider, Icon, IconButton, Paper, Toolbar } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions/index';
import reducer from './store/reducers';
import FuseLoading from '@fuse/core/FuseLoading';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
	root: {
		width: 500
	}
}));

function PrizeSidePanel(props) {
	const dispatch = useDispatch();
	const state = useSelector(({ leaguePage }) => {
		return leaguePage.league.prizePanel.state;
	});
	const leagueData = useSelector(({ leaguePage }) => leaguePage.league.prizePanel.leagueData);

	const classes = useStyles();

	return (
		<Drawer
			classes={{ paper: classes.root }}
			open={state}
			anchor="right"
			// variant="persistent"
			onClose={ev => dispatch(Actions.togglePrizeListPanelClose())}
		>
			{leagueData ? (
				<React.Fragment>
					<AppBar position="static" color="secondary" elevation={2}>
						<Toolbar className="px-4">
							<div className="flex-row flex-1 items-center px-12">
								<Typography className="text-16" color="inherit">
									{leagueData && leagueData.leagueName}
								</Typography>
							</div>
						</Toolbar>
					</AppBar>
					<Paper className="w-full rounded-8 shadow-none border-1">
						<div className="p-16 px-4 flex flex-row items-center justify-between">
							<Typography className="h1 px-12">Prizes</Typography>

							{/* <div>
								<IconButton aria-label="more">
									<Icon>more_vert</Icon>
								</IconButton>
							</div> */}
						</div>

						<table className="simple clickable">
							<thead>
								<tr>
									<th className="text-left">Position</th>

									<th className="text-right">Prize Amount</th>
								</tr>
							</thead>
							<tbody>
								{leagueData.prize.length ? (
									leagueData.prize.map((row, key) => (
										<tr key={key}>
											<td>{moment.localeData().ordinal(key + 1) + ' Prize:'}</td>

											<td className="text-right"> {leagueData.gameCurrency} {row} </td>
										</tr>
									))
								) : (
									<tr>
										<td>No Prize</td>
										<td></td>
										<td></td>
									</tr>
								)}
							</tbody>
						</table>

						<Divider className="card-divider w-full" />
					</Paper>
				</React.Fragment>
			) : (
				<FuseLoading />
			)}
		</Drawer>
	);
}

export default PrizeSidePanel;
