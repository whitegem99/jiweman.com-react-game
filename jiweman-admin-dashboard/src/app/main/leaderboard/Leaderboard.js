import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Icon, Input, Paper, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget11 from './widgets/Widget11';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
}));

function LeaderboardPage(props) {
	const dispatch = useDispatch();
	const leaderboard = useSelector(({ leaderboardPage }) => leaderboardPage.leaderboard);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [searchText, setSearchText] = useState(null);

	const gameType = [{
		label: 'One on One',
		value: 'oneonone',
	}, {
		label: 'League Game Play',
		value: 'leagueGamePlay',
	}];

	const [selectedGameType, setSelectedGameType] = useState(gameType[0].value);
	const [selectedLeague, setSelectedLeague] = useState({});
	const [showLeague, setShowLeague] = useState(false);

	useEffect(() => {
		(async () => {
			dispatch(Actions.getLeagueForLeaderboard());
			dispatch(Actions.getLeaderboard({
				gameType: gameType[0].value
			}));
		})()
		// eslint-disable-next-line
	}, []);

	const handleSelectedGameTypeChange = (e) => {
		setSelectedGameType(e.target.value)
		setSelectedLeague({});

		if (e.target.value === gameType[0].value) {
			setShowLeague(false);
			dispatch(Actions.getLeaderboard({
				gameType: e.target.value
			}))
		} else {
			setShowLeague(true)
			dispatch(Actions.resetLeaderboardDate());
		}

	}

	const handleSelectedLeague = (e) => {
		setSelectedLeague(e.target.value)
		dispatch(Actions.getLeaderboard({
			gameType: selectedGameType,
			leagueId: e.target.value._id
		}));
	}


	if (leaderboard.leagueLoading) {
		return <FuseLoading />;
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
									<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
										<Typography className=" text-18 font-300">
											Leaderboard
										</Typography>
										<div className="flex flex-row self-end w-full max-w-512 ">
											<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8">
												<Icon color="action">search</Icon>

												<Input
													placeholder="Search"
													className="flex flex-1 mx-8"
													disableUnderline
													fullWidth
													onChange={e => setSearchText(e.target.value || null)}
													inputProps={{
														'aria-label': 'Search'
													}}
												/>
											</Paper>
											{/* <div className="ml-8">
												<Button variant="contained" color="secondary" startIcon={<AddBox />}>
													Add
												</Button>
											</div> */}
										</div>
									</div>

								</FuseAnimate>

								<FuseAnimateGroup
									className="flex flex-wrap"
									enter={{
										animation: 'transition.slideUpBigIn'
									}}
								>
									<div className="widget flex w-full">
										<FormControl className="flex w-full sm:w-320 mx-16" variant="outlined">
											<InputLabel htmlFor="category-label-placeholder"> Game Type </InputLabel>
											<Select
												value={selectedGameType}
												onChange={handleSelectedGameTypeChange}
												input={
													<OutlinedInput
														labelWidth={'category'.length * 9}
														name="category"
														id="category-label-placeholder"
													/>
												}
											>

												{gameType.map(({ label, value }) => (
													<MenuItem value={value} key={value}>
														{label}
													</MenuItem>
												))}
											</Select>
										</FormControl>
										{showLeague ? <FormControl className="flex w-full sm:w-320 mx-16" variant="outlined">
											<InputLabel htmlFor="category-label-placeholder"> League Type </InputLabel>
											<Select
												value={selectedLeague}
												onChange={handleSelectedLeague}
												input={
													<OutlinedInput
														labelWidth={'category'.length * 9}
														name="category"	
														id="category-label-placeholder"
													/>
												}
											>

												{leaderboard.leagueData.map((leagueOb) => (
													<MenuItem value={leagueOb} key={leagueOb._id}>
														{leagueOb.leagueName}
													</MenuItem>
												))}
											</Select>
										</FormControl> : <div />}
									</div>
								</FuseAnimateGroup>

								<FuseAnimateGroup
									className="flex flex-wrap"
									enter={{
										animation: 'transition.slideUpBigIn'
									}}
								>
									<div className="widget flex w-full p-12">
										<Widget11 text={searchText} data={leaderboard.data} gameType={selectedGameType} league={selectedLeague}/>
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

export default withReducer('leaderboardPage', reducer)(LeaderboardPage);
