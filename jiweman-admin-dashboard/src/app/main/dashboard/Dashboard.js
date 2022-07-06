import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget1 from './widgets/Widget1';
import Widget12 from './widgets/Widget12';
import Widget13 from './widgets/Widget13';
import Widget8 from './widgets/Widget8';
import { IconButton, Icon } from '@material-ui/core';
import * as GlobalActions from 'app/store/actions';
import Widget17 from './widgets/Widget17';
import Widget18 from './widgets/Widget18';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
	selectedProject: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '8px 0 0 0'
	},
	projectMenuButton: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '0 8px 0 0',
		marginLeft: 1
	}
}));

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	const widgets = useSelector(({ projectDashboardApp }) => projectDashboardApp.widgets);
	const { transactions, deposits, withdrawals } = useSelector(({ projectDashboardApp }) => projectDashboardApp);
	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(Actions.getWidgets());
	}, [dispatch]);

	if (widgets.loading) {
		return <FuseLoading />;
	}

	if (!widgets.data) {
		return null;
	}
	
	return (
		<FusePageSimple
			classes={{
				header: 'min-h-160 h-160',
				toolbar: 'min-h-48 h-48',
				rightSidebar: 'w-288',
				content: classes.content
			}}
			content={
				<div className="p-12 pb-64">
					<FuseAnimate animation="transition.slideUpIn">
						<div className="flex flex-col md:flex-row sm:p-8 container">
							<div className="flex flex-1 flex-col min-w-0">
								<FuseAnimate delay={600}>
									<div className="flex flex-row justify-between">
										<Typography className="p-16 pb-8 text-18 font-300">
											How active are your users ?
										</Typography>
										<div className="flex flex-row">
											<Typography className="p-16 pb-8 text-18 font-300">
												<IconButton
													size="small"
													aria-label="Edit"
													onClick={() => {
														dispatch(Actions.updateWidgets());
														dispatch(
															GlobalActions.showMessage({
																message:
																	'Stats are calculated in background. Please Check back in few seconds(~15) for the updated stats.', //text or html
																autoHideDuration: 6000, //ms
																anchorOrigin: {
																	vertical: 'top', //top bottom
																	horizontal: 'right' //left center right
																},
																variant: 'success' //success error info warning null
															})
														);
													}}
												>
													<Icon>refresh</Icon>
												</IconButton>
												Last Updated: {moment(widgets.data.updatedAt).format('LL')}{' '}
												{moment(widgets.data.updatedAt).format('LTS')}
											</Typography>
										</div>
									</div>
								</FuseAnimate>
								<FuseAnimateGroup
									className="flex flex-wrap"
									enter={{
										animation: 'transition.slideUpBigIn'
									}}
								>
									<div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
										<Widget1
											widget={{
												label: 'One on One Matches',
												value: widgets.data.macthesCount ? widgets.data.macthesCount.oneonone ? widgets.data.macthesCount.oneonone : 0 : 0 
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
										<Widget1
											widget={{
												label: 'League Matches',
												value: widgets.data.macthesCount ? widgets.data.macthesCount.leagueGamePlay ? widgets.data.macthesCount.leagueGamePlay : 0 : 0 
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
										<Widget1
											widget={{
												label: 'Players Onboarded',
												value: widgets.data.totalPlayersOnboarded
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
										<Widget1
											widget={{
												label: 'Build Downloads',
												value: widgets.data.downloads
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
										<Widget1
											widget={{
												label: 'Total Goals',
												value: widgets.data.totalGoals
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
										<Widget1
											widget={{
												label: 'Ongoing Leagues',
												value: widgets.data.onGoingLeagues
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/2 p-12">
										<Widget8
											widget={{
												title: 'Gender Wise Player',
												chartData: widgets.data.statsByGender
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/2 p-12">
										<Widget8
											widget={{
												title: 'Country Wise Players',
												chartData: widgets.data.statsByCountry,
												cutout: 60
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/2 p-12">
										<Widget12
											widget={{
												title: 'Age Wise Players',
												chartData: widgets.data.agewise,
												cutout: 60
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/2 p-12">
										<Widget13
											widget={{
												title: 'Transactions',
												chartData: transactions.data,
												cutout: 60,
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/2 p-12">
										<Widget17
											widget={{
												title: 'Deposits',
												chartData: deposits.data,
												cutout: 60,
											}}
										/>
									</div>
									<div className="widget flex w-full sm:w-1/2 md:w-1/2 p-12">
										<Widget18
											widget={{
												title: 'Withdraw',
												chartData: withdrawals.data,
												cutout: 60,
											}}
										/>
									</div>
								</FuseAnimateGroup>
							</div>
						</div>
					</FuseAnimate>
				</div>
			}
			ref={pageLayout}
		/>
	);
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);
