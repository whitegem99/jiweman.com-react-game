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

const useStyles = makeStyles(theme => ({
	root: {
		width: 500
	}
}));

function ProcessLeaguePanel(props) {
	const dispatch = useDispatch();
	const state = useSelector(({ processLeague }) => processLeague.processLeague.state);
	const winners = useSelector(({ processLeague }) => processLeague.processLeague.winners);
	const leagueData = useSelector(({ processLeague }) => processLeague.processLeague.leagueData);
	const processedWinnerSuccess = useSelector(
		({ processLeague }) => processLeague.processLeague.processedWinnerSuccess
	);
	const classes = useStyles();

	useEffect(() => {
		if (leagueData && leagueData._id) {
			dispatch(
				Actions.getWinnerList({
					leagueId: leagueData._id
				})
			);
		}
	}, [dispatch, leagueData]);

	const handleProcessLeague = ev => {
		dispatch(
			Actions.initiateProcessLeague({
				leagueId: leagueData._id
			})
		);
	};

	return (
		<Drawer
			classes={{ paper: classes.root }}
			open={state}
			anchor="right"
			// variant="persistent"
			onClose={ev => dispatch(Actions.togglePanelClose())}
		>
			{leagueData && winners.loading === false ? (
				<React.Fragment>
					<AppBar position="static" color="secondary" elevation={2}>
						<Toolbar className="px-4">
							<div className="flex-row flex-1 items-center px-12">
								<Typography className="text-16" color="inherit">
									Process {leagueData && leagueData.leagueName}
								</Typography>
							</div>

							<div className="flex px-4">
								<Button
									className={classes.button}
									endIcon={<Icon>close</Icon>}
									onClick={ev => dispatch(Actions.togglePanelClose())}
								>
									Close
								</Button>
							</div>
						</Toolbar>
					</AppBar>
					<Paper className="w-full rounded-8 shadow-none border-1">
						<div className="p-16 px-4 flex flex-row items-center justify-between">
							<Typography className="h1 px-12">Top Winners</Typography>

							<div>
								<IconButton aria-label="more">
									<Icon>more_vert</Icon>
								</IconButton>
							</div>
						</div>

						<table className="simple clickable">
							<thead>
								<tr>
									<th className="text-left">Position</th>
									<th className="text-right">Name</th>
									<th className="text-right">League Round</th>
									<th className="text-right">Amount</th>
								</tr>
							</thead>
							<tbody>
								{winners.data.length ? (
									winners.data.map((row, key) => (
										<tr key={key}>
											<td>{row.leagueWinnerPosition}</td>
											<td className="text-right">{row.user.fullName}</td>
											<td className="text-right">{row.leaderboard.leagueRound}</td>
											<td className="text-right">{leagueData.gameCurrency + ' '}{row.amount}</td>
										</tr>
									))
								) : (
										<tr>
											<td>No Winners</td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
									)}
								<tr>
									<td>Total</td>
									<td></td>
									<td></td>
									<td className="text-right">
										{leagueData.gameCurrency + ' '}
										{parseFloat(
											winners.data.reduce(
												(sum, { amount }) => parseFloat(amount) + parseFloat(sum),
												0
											)
										).toFixed(2)}
									</td>
								</tr>
							</tbody>
						</table>

						<Divider className="card-divider w-full" />

						<div className="p-16 flex flex-row items-center justify-between">
							{processedWinnerSuccess ? (
								<Typography className="h3">League Processed...</Typography>
							) : (
									<React.Fragment>
										<Typography className="h3">Please verify the winners and process</Typography>
										<Button
											variant="outlined"
											endIcon={<Icon>send</Icon>}
											disabled={winners.data.length === 0 || processedWinnerSuccess}
											onClick={handleProcessLeague}
										>
											Process
									</Button>
									</React.Fragment>
								)}
						</div>
					</Paper>
				</React.Fragment>
			) : (
					<FuseLoading />
				)}
		</Drawer>
	);
}

export default withReducer('processLeague', reducer)(ProcessLeaguePanel);
