import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseCountdown from '@fuse/core/FuseCountdown';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Button, Card, CardContent, Chip, Fab, Icon, IconButton, Tooltip, useMediaQuery, Tabs, Tab } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GetAppIcon from '@material-ui/icons/GetApp';
import HelpOutLine from '@material-ui/icons/HelpOutline';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { useDispatch, useSelector } from 'react-redux';
import DownloadInstructions from './DownloadInstructions';
import PaymentDialog from './PaymentDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import PrizeSidePanel from './PrizeDialog';
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
	},
	fab: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
		zIndex: 10,
		margin: theme.spacing(1)
	},
	extendedIcon: {
		marginRight: theme.spacing(1)
	},
	exampleWrapper: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),

		zIndex: 10
	},
	radioGroup: {
		margin: theme.spacing(1, 0)
	},
	speedDial: {
		position: 'absolute',
		'&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
			bottom: theme.spacing(2),
			right: theme.spacing(2)
		},
		'&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
			top: theme.spacing(2),
			left: theme.spacing(2)
		}
	}
}));

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const league = useSelector(({ leaguePage }) => leaguePage.league);
	console.log(league)
	const [open, setOpen] = React.useState(false);
	const pageLayout = useRef(null);
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		dispatch(Actions.getLeague());
		dispatch(Actions.getOneOnOne());
	}, [dispatch]);

	if (league.loading) {
		// return <FuseLoading />;
	}

	if (!league.data || !league.oneOnOneData) {
		return null;
	}

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	function handleChangeTab(event, value) {
		setTabValue(value);
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
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="off"
						className="w-full border-b-1 px-24"
					>
						<Tab className="text-14 font-600 normal-case" label="League" />
						<Tab className="text-14 font-600 normal-case" label="One On One" />
						{/* <Tab className="text-14 font-600 normal-case" label="Team Members" /> */}
					</Tabs>
				}
				content={
					<div className="p-12">
						{tabValue === 0 && (<div className="p-4 pb-64">
							<FuseAnimate animation="transition.slideUpIn">
								<div className="flex flex-col md:flex-row sm:p-4 container">
									<div className="flex flex-1 flex-col min-w-0">
										<FuseAnimate delay={600}>
											<Typography className="p-16 py-8 text-18 font-300">
												Get Started, don't miss the chance to win!
									</Typography>
										</FuseAnimate>
										<FuseAnimateGroup className="flex flex-wrap justify-center">
											<>
												{league.data
													.filter(
														({ leagueStatus }) =>
															leagueStatus !== 'closed' && leagueStatus !== 'ended'
													)
													.map((ob, key) => {
														return (
															<LeagueCard
																ob={ob}
																key={key}
																isLast={
																	league.data.filter(
																		({ leagueStatus }) =>
																			leagueStatus !== 'closed' &&
																			leagueStatus !== 'ended'
																	).length ===
																	key + 1
																}
															/>
														);
													})}
												{league.data.filter(
													({ leagueStatus }) =>
														leagueStatus !== 'closed' && leagueStatus !== 'ended'
												).length === 0 ? (
														<Typography className="p-16 py-8 text-24 font-300">
															No Upcoming/Ongoing Leagues
														</Typography>
													) : (
														<></>
													)}
											</>
										</FuseAnimateGroup>
									</div>
								</div>
							</FuseAnimate>
						</div>
						)}
						{tabValue === 1 && (<div className="p-4 pb-64">
							<FuseAnimate animation="transition.slideUpIn">
								<div className="flex flex-col md:flex-row sm:p-4 container">
									<div className="flex flex-1 flex-col min-w-0">
										<FuseAnimate delay={600}>
											<Typography className="p-16 py-8 text-18 font-300">
												Get Started, don't miss the chance to win!
									</Typography>
										</FuseAnimate>
										<FuseAnimateGroup className="flex flex-wrap justify-center">
											<>
												{league.oneOnOneData
													// .filter(
													// 	({ leagueStatus }) =>
													// 		leagueStatus !== 'closed' && leagueStatus !== 'ended'
													// )
													.map((ob, key) => {
														return (
															<OneOnOneCard
																ob={ob}
																key={key}
																isLast={
																	league.oneOnOneData.length ===
																	key + 1
																}
															/>
														);
													})}
												{league.oneOnOneData.length === 0 ? (
													<Typography className="p-16 py-8 text-24 font-300">
														No Upcoming/Ongoing One on One
													</Typography>
												) : (
														<></>
													)}
											</>
										</FuseAnimateGroup>
									</div>
								</div>
							</FuseAnimate>
						</div>
						)}

					</div>
				}
				ref={pageLayout}
			/>

			<div className={classes.exampleWrapper}>
				{/* <Backdrop open={open} /> */}
				<Fab
					variant="extended"
					color="primary"
					aria-label="add"
					// className={classes.fab}
					onClick={() => {
						window.open('https://install.appcenter.ms/users/accounts-jiweman.com/apps/joga-bonito/distribution_groups/users', '_blank');
					}}
				>
					<GetAppIcon className={classes.extendedIcon} />
					Game Download
				</Fab>
				<Fab
					color="primary"
					aria-label="add"
					// className={classes.fab}
					onClick={() => {
						open ? handleClose() : handleOpen();
					}}
					className="ml-8"
				>
					<HelpOutLine />
				</Fab>
			</div>
			<PaymentDialog></PaymentDialog>
			<PrizeSidePanel></PrizeSidePanel>
			<DownloadInstructions open={open} setOpen={setOpen}></DownloadInstructions>
		</>
	);
}

function LeagueCard(props) {
	const { ob } = props;
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const [isFlipped, setIsFlipped] = useState(false);
	const theme = useTheme();

	const matches = useMediaQuery(theme.breakpoints.up('sm'));

	function getPropsForCountDown(league) {
		if (league.leagueStatus === 'active') {
			return {
				endDate: moment(league.endDate),
				message: 'League Ends in'
			};
		}

		if (league.leagueStatus === 'upcoming') {
			const now = moment();
			const endSaleDate = moment(league.endSaleDate);
			const startSaleDate = moment(league.startSaleDate);
			if (now < startSaleDate) {
				return {
					endDate: startSaleDate,
					message: 'Sale Starts in'
				};
			}

			if (now < endSaleDate) {
				return {
					endDate: endSaleDate,
					message: 'Sale Ends in'
				};
			} else {
				return {
					endDate: moment(league.startDate),
					message: 'League Starts in'
				};
			}
		}
	}

	return (
		<ReactCardFlip
			isFlipped={isFlipped}
			flipDirection="horizontal"
			containerStyle={{
				...(matches && { width: '33.333333%' }),
				width: '100%',
				maxWidth: '36rem',
				padding: '1.2rem',
				// height: '778.715px'
				...{ paddingBottom: '5em' }
			}}
		>
			{/* Card Front */}
			<Card
				className="relative"
				raised
				style={{
					...(!ob.isLeagueValidForPlayer && {
						pointerEvents: 'none',
						opacity: 0.6
					}),
					height: '100%'
					// height: '778.715px'
				}}
			>
				<div className="top-0 inset-x-0 flex ">
					<div className={clsx(classes.badge, 'flex-1')}>
						<img src={ob.leagueCardImageUrl} alt="post"></img>
					</div>
				</div>

				<div className="py-12 text-center">
					<div className="flex items-center justify-center">
						<Typography variant="subtitle1" color="inherit" className="text-20 font-medium">
							{ob.leagueName}
						</Typography>
						<Tooltip title="More Info/Rules">
							<span>
								<IconButton aria-label="info" size="small" onClick={() => setIsFlipped(!isFlipped)}>
									<HelpOutLine fontSize="inherit" />
								</IconButton>
							</span>
						</Tooltip>
					</div>
					<Chip color="primary" style={{ textTransform: 'capitalize' }} label={ob.leagueStatus} />
				</div>

				<CardContent className="text-center p-0">
					<div className="flex flex-col">
						<div className="flex justify-center mb-8">
							<Typography variant="h5" color="textSecondary" className="font-medium">
								{ob.gameRegionType === 'international' ? '$' : ob.gameCurrency}
							</Typography>
							<Typography className="text-40 mx-4 font-light leading-none">
								{ob.entryFeeWithCommission}
							</Typography>
						</div>
						<div>
							{ob.isLeagueValidForPlayer && (
								<div className="flex flex-row justify-center">
									<Typography color="textSecondary" className="font-medium">
										({ob.localEntryFeeWithCommission}&nbsp;
										{ob.localCurrency})
									</Typography>
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-col p-8">
						<Typography variant="subtitle1" className="mb-8 flex self-center items-baseline">
							<span className="font-bold mx-4">{ob.numberOfPrizes}</span>
							Prizes
							<Tooltip title="League will have increased variable prize, based on the tickets sold">
								<Icon
									style={{
										fontSize: '1.4rem',
										marginLeft: '2px'
									}}
								>
									info
								</Icon>
							</Tooltip>
						</Typography>
						<Typography variant="subtitle1" className="mb-8 flex self-center items-baseline">
							<span className="font-bold mx-4">{ob.gameCount}</span>
							Games
							<Tooltip title="Player can participate in as many rounds as he wishes">
								<Icon
									style={{
										fontSize: '1.4rem',
										marginLeft: '2px'
									}}
								>
									info
								</Icon>
							</Tooltip>
						</Typography>
						<Typography variant="subtitle1" className="mb-8">
							<span className="font-bold mx-4">{ob.numberOfGoalsToWin}</span>
							Goals required to win
						</Typography>
						{ob.prize &&
							ob.prize.slice(0, 3).map((p, i) => (
								<div key={i} className="flex flex-row m-auto">
									<Typography>
										<span className="font-bold mx-4">
											{moment.localeData().ordinal(i + 1) + ' Prize:'}
										</span>
									</Typography>
									<Typography>
										<span className="font-bold mx-4">{ob.gameRegionType === 'international' ? '$' : ob.gameCurrency}{" " + p}</span>
									</Typography>
								</div>
							))}
						{/* <Typography variant="subtitle1" className="mb-8"></Typography> */}
						<Button
							size="small"
							variant="text"
							className="mb-8 m-auto"
							onClick={() => {
								dispatch(Actions.togglePanelOpen(ob));
							}}
						>
							View all prize
						</Button>

						<Typography variant="subtitle1" className="mb-8">
							Starts <span className="font-bold mx-4">{moment(ob.startDate).utc().format('LLL')}</span>
						</Typography>
						<Typography variant="subtitle1" className="mb-8">
							Ends <span className="font-bold mx-4">{moment(ob.endDate).utc().format('LLL')}</span>
						</Typography>
					</div>
				</CardContent>

				<div className="flex flex-col justify-center pb-32">
					<div className="flex justify-center mb-12">
						<FuseCountdown {...getPropsForCountDown(ob)}></FuseCountdown>
					</div>
					<Button
						variant="contained"
						color="secondary"
						className="min-w-128 self-center"
						disabled={
							// ob.leagueStatus === 'upcoming' ||
							!ob.isLeagueValidForPlayer ||
							ob.isLeagueAlreadyActiveForUser
						}
						onClick={e => {
							console.log(e.target);
							dispatch(
								parseFloat(ob.entryFee) > 0
									? Actions.openPaymentDialog(ob)
									: (e.target.setAttribute('disabled', true),
										(e.currentTarget.className += ' Mui-disabled'),
										Actions.joinFreeLeague({
											leagueId: ob._id
										}))
							);
						}}
					>
						<>
							{ob.currentRound === 0
								? ob.isLeagueValidForPlayer
									? parseFloat(ob.entryFee) === 0
										? 'FREE'
										: 'Purchase'
									: 'Not Eligible'
								: ''}
						</>
						<>
							{ob.currentRound
								? 'Activate Round ' +
								(ob.currentRound + 1) +
								(parseFloat(ob.entryFee) === 0 ? ' (FREE)' : ' (PAID)')
								: ''}
						</>
					</Button>
				</div>
			</Card>
			{/* Card Back */}
			<Card
				className="relative"
				raised
				style={{
					...(!ob.isLeagueValidForPlayer && {
						pointerEvents: 'none',
						opacity: 0.6
					}),
					// height: '778.715px'
					height: '100%'
				}}
			>
				<div className="py-12 text-center flex flex-1 items-center">
					<IconButton
						onClick={() => {
							setIsFlipped(false);
						}}
					>
						<Icon fontSize="small">arrow_back</Icon>
					</IconButton>
					<Typography variant="subtitle1" color="inherit" className="text-20 pl-2 font-medium">
						Rules &amp; Conditions
					</Typography>
				</div>

				<CardContent className=" p-0">
					<div className="flex flex-col p-8">
						{ob.leagueInfo.map((info, key) => {
							return (
								<Typography variant="subtitle1" className="mb-8" key={key}>
									<span className="font-bold mx-4">{key + 1}.</span>
									{info}
								</Typography>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</ReactCardFlip>
	);
}


function OneOnOneCard(props) {
	const { ob } = props;
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const [isFlipped, setIsFlipped] = useState(false);
	const theme = useTheme();

	const matches = useMediaQuery(theme.breakpoints.up('sm'));


	return (
		<ReactCardFlip
			isFlipped={isFlipped}
			flipDirection="horizontal"
			containerStyle={{
				...(matches && { width: '33.333333%' }),
				width: '100%',
				maxWidth: '36rem',
				padding: '1.2rem',
				// height: '778.715px'
				...{ paddingBottom: '5em' }
			}}
		>
			{/* Card Front */}
			<Card
				className="relative"
				raised
				style={{
					// ...(!ob.isLeagueValidForPlayer && {
					// 	pointerEvents: 'none',
					// 	opacity: 0.6
					// }),
					height: '100%'
					// height: '778.715px'
				}}
			>
				<div className="top-0 inset-x-0 flex ">
					{/* <div className={clsx(classes.badge, 'flex-1')}>
						<img src={ob.cardImage} alt="post"></img>
					</div> */}
				</div>

				<div className="py-12 text-center">
					<div className="flex items-center justify-center">
						<Typography variant="subtitle1" color="inherit" className="text-20 font-medium">
							{ob.gameName}
						</Typography>
						<Tooltip title="More Info/Rules">
							<span>
								<IconButton aria-label="info" size="small" onClick={() => setIsFlipped(!isFlipped)}>
									<HelpOutLine fontSize="inherit" />
								</IconButton>
							</span>
						</Tooltip>
					</div>
					{/* <Chip color="primary" style={{ textTransform: 'capitalize' }} label={ob.leagueStatus} /> */}
				</div>

				<CardContent className="text-center p-0">
					<div className="flex flex-col">
						<div className="flex justify-center mb-8">
							<Typography variant="h5" color="textSecondary" className="font-medium">
								{ob.gameRegionType === 'international' ? '$' : ob.gameCurrency}
							</Typography>
							<Typography className="text-40 mx-4 font-light leading-none">
								{ob.entryFee}
							</Typography>
						</div>
						<div>

							<div className="flex flex-row justify-center">
								<Typography color="textSecondary" className="font-medium">
									({ob.localEntryFeeWithCommission}&nbsp;
										{ob.localCurrency})
									</Typography>
							</div>

						</div>
					</div>

					<div className="flex flex-col p-8">
						<Typography variant="subtitle1" className="mb-8">
							<span className="font-bold mx-4">{ob.numberOfGoalsToWin}</span>
							Goals required to win
						</Typography>

						< div className="flex flex-row m-auto">
							<Typography>
								<span className="font-bold mx-4">
									Prize:
										</span>
							</Typography>
							<Typography>
								<span className="font-bold mx-4">{ob.gameRegionType === 'international' ? '$' : ob.gameCurrency}{" " + ob.prize}</span>
							</Typography>
						</div>

						{/* <Typography variant="subtitle1" className="mb-8"></Typography> */}



					</div>
				</CardContent>

				<div className="flex flex-col justify-center pb-32">

					<Button
						variant="contained"
						color="secondary"
						className="min-w-128 self-center"
						// disabled={
						// 	// ob.leagueStatus === 'upcoming' ||
						// 	!ob.isLeagueValidForPlayer ||
						// 	ob.isLeagueAlreadyActiveForUser
						// }
						onClick={e => {
							console.log(e.target);
							// dispatch(Actions.buyOneOnOne())
							// dispatch(
							// 	parseFloat(ob.entryFee) > 0
							// 		? Actions.openPaymentDialog(ob)
							// 		: (e.target.setAttribute('disabled', true),
							// 			(e.currentTarget.className += ' Mui-disabled'),
							// 			Actions.joinFreeLeague({
							// 				leagueId: ob._id
							// 			}))
							// );
						}}
					>
						{/* <>
							{ob.currentRound === 0
								? ob.isLeagueValidForPlayer
									? parseFloat(ob.entryFee) === 0
										? 'FREE'
										: 'Purchase'
									: 'Not Eligible'
								: ''}
						</> */}
						Purchase

					</Button>
				</div>
			</Card>
			{/* Card Back */}
			<Card
				className="relative"
				raised
				style={{
					// ...(!ob.isLeagueValidForPlayer && {
					// 	pointerEvents: 'none',
					// 	opacity: 0.6
					// }),
					// height: '778.715px'
					height: '100%'
				}}
			>
				<div className="py-12 text-center flex flex-1 items-center">
					<IconButton
						onClick={() => {
							setIsFlipped(false);
						}}
					>
						<Icon fontSize="small">arrow_back</Icon>
					</IconButton>
					<Typography variant="subtitle1" color="inherit" className="text-20 pl-2 font-medium">
						Rules &amp; Conditions
					</Typography>
				</div>

				<CardContent className=" p-0">
					<div className="flex flex-col p-8">
						{ob.gameInfo.map((info, key) => {
							return (
								<Typography variant="subtitle1" className="mb-8" key={key}>
									<span className="font-bold mx-4">{key + 1}.</span>
									{info}
								</Typography>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</ReactCardFlip >
	);
}

export default withReducer('leaguePage', reducer)(ProjectDashboardApp);
