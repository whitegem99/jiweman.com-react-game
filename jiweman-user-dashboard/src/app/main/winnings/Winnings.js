import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Button, Card, CardContent, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import PaymentDialog from './PaymentDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import WinningDialog from './ClaimWinningDialog';
import HelpOutLine from '@material-ui/icons/HelpOutline';

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
	},
	badge: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.getContrastText(theme.palette.error.main)
	}
}));

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	// const user = useSelector(({ auth }) => auth.user);
	const winnings = useSelector(({ winningsPage }) => winningsPage.winnings);
	// const [tabValue, setTabValue] = useState(0);
	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(Actions.getWinnings());
	}, [dispatch]);

	// function handleChangeTab(event, value) {
	// 	setTabValue(value);
	// }

	if (winnings.loading) {
		return <FuseLoading />;
	}

	if (!winnings.data) {
		return null;
	}

	return (
		<>
			<FusePageSimple
				classes={{
					header: 'min-h-60 h-60',
					toolbar: 'min-h-48 h-48',
					rightSidebar: 'w-288',
					content: classes.content
				}}
				content={
					<div className="p-4 pb-64">
						<FuseAnimate animation="transition.slideUpIn">
							<div className="flex flex-col md:flex-row sm:p-4 container">
								<div className="flex flex-1 flex-col min-w-0">
									<FuseAnimate delay={600}>
										<Typography className="p-16 py-8 text-18 font-300">
											My Winning History
										</Typography>
									</FuseAnimate>
									<FuseAnimateGroup
										className="flex flex-wrap "
										enter={{
											animation: 'transition.slideUpBigIn'
										}}
									>
										{winnings.data && winnings.data.length === 0 && (
											<Typography className="p-16 py-8 text-18 font-300">
												Sorry No Winnings Yet. Play More, Win More
											</Typography>
										)}
										{/* {winnings.data && winnings.data.length === 0 && (
											<div>Show Cards</div>
										)} */}

										{winnings.data &&
											winnings.data.length &&
											winnings.data.map((ob, key) => {
												return (
													<div className="w-full max-w-360 sm:w-1/3 p-12" key={key}>
														<Card className="relative" raised>
															<div className="top-0 inset-x-0 flex ">
																<div
																	className={clsx(
																		'flex w-full p-6 pt-16 justify-center'
																	)}
																>
																	{[1, 2, 3].includes(ob.leagueWinnerPosition) ? (
																		<img
																			src={`assets/images/logos/medal-${ob.leagueWinnerPosition}.svg`}
																			alt="post"
																			className="h-136"
																		></img>
																	) : (
																			<div className="h-136 text-center">
																				<img
																					src={`assets/images/logos/medal.svg`}
																					alt="post"
																					className="h-92"
																				></img>
																				<Typography
																					variant="subtitle1"
																					color="inherit"
																					className="text-32 font-medium"
																				>
																					{ob.leagueWinnerPosition}th
																			</Typography>
																			</div>
																		)}
																</div>
															</div>

															<div className="py-12 text-center">
																<Typography
																	variant="subtitle1"
																	color="inherit"
																	className="text-24 font-medium"
																>
																	{ob.league.leagueName}
																</Typography>
															</div>

															<CardContent className="text-center p-0">
																<div className="flex flex-col">
																	<div className="flex justify-center mb-8">
																		<Typography
																			variant="h5"
																			color="textSecondary"
																			className="font-medium"
																		>
																			{ob.league.gameRegionType === 'international' ? '$' : ob.league.gameCurrency}
																		</Typography>
																		<Typography className="text-40 mx-4 font-light leading-none">
																			{ob.amount}
																		</Typography>
																		<Tooltip
																			title={
																				'$0.07 Payment Gateway commission deduction applicable $' +
																				ob.amountWithPGCommission +
																				' | ' +
																				ob.localAmountWithPGCommission +
																				' ' +
																				ob.localCurrency
																			}
																			className="self-center"
																		>
																			<span>
																				<IconButton
																					aria-label="info"
																					size="small"
																				// onClick={() =>
																				// 	setIsFlipped(!isFlipped)
																				// }
																				>
																					<HelpOutLine fontSize="inherit" />
																				</IconButton>
																			</span>
																		</Tooltip>
																	</div>
																	<div>
																		<div className="flex flex-row justify-center">
																			<Typography
																				color="textSecondary"
																				className="font-medium"
																			>
																				({ob.localAmount}&nbsp;
																				{ob.localCurrency})
																			</Typography>
																		</div>
																	</div>
																</div>

																<div className="flex flex-col p-8">
																	<Typography variant="subtitle1" className="mb-8">
																		<span className="font-bold mx-4">
																			Round {ob.leaderboard.leagueRound}
																		</span>
																	</Typography>

																	<Typography variant="subtitle1" className="mb-8">
																		<span className="font-bold mx-4">
																			{moment(ob.createdAt).format('ll')}
																		</span>
																	</Typography>
																</div>
															</CardContent>

															{/* <div className="flex flex-col justify-center pb-32">
																<Button
																	variant="contained"
																	color="secondary"
																	className="w-128 self-center"
																	disabled={ob.hasClaimed || ob.state !== 'created'}
																	onClick={() => {
																		dispatch(
																			Actions.claimLeaguePrize({
																				winningId: ob._id
																			})
																		);
																	}}
																>
																	{ob.state === 'created'
																		? 'Claim'
																		: ob.hasClaimed
																		? 'Claimed'
																		: 'Initiated'}
																</Button>
															</div> */}
														</Card>
													</div>
												);
											})}
									</FuseAnimateGroup>
								</div>
							</div>
						</FuseAnimate>
					</div>
				}
				ref={pageLayout}
			/>
			<WinningDialog></WinningDialog>
		</>
	);
}

export default withReducer('winningsPage', reducer)(ProjectDashboardApp);
