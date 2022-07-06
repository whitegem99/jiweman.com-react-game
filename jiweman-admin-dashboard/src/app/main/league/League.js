import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Button, Icon, Input, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/Add';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LeagueDialog from './LeagueDialog';
import ProcessLeaguePanel from './ProcessLeaguePanel';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import TableWidget from './widgets/TableWidget';
import * as SettingsActions from '../settings/store/actions';
import PrizeSidePanel from './PrizePanel';
const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	}
}));

function LeaguePage(props) {
	const dispatch = useDispatch();
	const league = useSelector(({ leaguePage }) => leaguePage.league);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [searchText, setSearchText] = useState(null);
	useEffect(() => {
		dispatch(Actions.getPlayers());
		dispatch(SettingsActions.getPrizeConfig());
	}, [dispatch]);

	const deleteLeague = row => {
		// console.log(row);
	};

	if (league.loading) {
		return <FuseLoading />;
	}

	if (!league.data) {
		return null;
	}

	return (
		<>
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
											<Typography className=" text-18 font-300">Leagues</Typography>
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
												<div className="ml-8">
													<Button
														variant="contained"
														color="secondary"
														startIcon={<AddBox />}
														onClick={() => dispatch(Actions.openNewLeagueDialog())}
													>
														Add
													</Button>
												</div>

												{/* <IconButton aria-label="Add" onClick={() => console.log('Add')}>
												<Icon>add_box</Icon>
											</IconButton> */}
											</div>
										</div>
									</FuseAnimate>

									<FuseAnimateGroup
										className="flex flex-wrap"
										enter={{
											animation: 'transition.slideUpBigIn'
										}}
									>
										<div className="widget flex w-full p-12">
											<TableWidget
												text={searchText}
												data={league.data}
												deleteFn={deleteLeague}
												editFn={ob => dispatch(Actions.openEditLeagueDialog(ob))}
												processFn={ob => dispatch(Actions.togglePanelOpen(ob))}
												openPrizePanel={ob => dispatch(Actions.togglePrizeListPanelOpen(ob))}
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
			<LeagueDialog />
			<ProcessLeaguePanel />
			<PrizeSidePanel></PrizeSidePanel>
		</>
	);
}

export default withReducer('leaguePage', reducer)(LeaguePage);
