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
import LeagueDialog from './OneOnOneDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import TableWidget from './widgets/TableWidget';
const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	}
}));

function OneOnOnePage(props) {
	const dispatch = useDispatch();
	const game = useSelector(({ oneOnOnePage }) => oneOnOnePage.game);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [searchText, setSearchText] = useState(null);
	useEffect(() => {
		dispatch(Actions.getGame());
		// dispatch(SettingsActions.getPrizeConfig());
	}, [dispatch]);

	const deleteLeague = row => {
		// console.log(row);
	};

	if (game.loading) {
		return <FuseLoading />;
	}

	if (!game.data) {
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
											<Typography className=" text-18 font-300">One on One</Typography>
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
														onClick={() => dispatch(Actions.openNewGameDialog())}
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
												data={game.data}
												deleteFn={deleteLeague}
												editFn={ob => dispatch(Actions.openEditGameDialog(ob))}
												// processFn={ob => dispatch(Actions.togglePanelOpen(ob))}
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
			{/* <ProcessLeaguePanel /> */}
		</>
	);
}

export default withReducer('oneOnOnePage', reducer)(OneOnOnePage);
