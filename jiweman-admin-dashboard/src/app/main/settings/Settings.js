import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/Add';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PrizeConfigDialog from './PrizeConfigDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget11 from './widgets/CommonSettings';
import PrizeConfigTable from './widgets/PrizeConfigTable';
import AppListTable from './widgets/AppListTable';
import AppUploadDialog from './AppUploadDialog';
import axios from 'axios';
import { CheckboxFormsy, SelectFormsy, TextFieldFormsy } from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import { MenuItem } from '@material-ui/core';

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

function SettingsPage(props) {
	const dispatch = useDispatch();
	const settings = useSelector(({ settingsPage }) => settingsPage.settings);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	// const [searchText, setSearchText] = useState(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		dispatch(Actions.getSettings());
		// dispatch(Actions.getPrizeConfig());
		dispatch(Actions.getAppList());
	}, [dispatch]);


	const [events, setEvents] = useState(null);
	const [referalSetting, setreferalSetting] = useState(null);
	const [isFormValid, setIsFormValid] = useState(false);
	

	useEffect(() => {
		axios.get('/getReferralEvents').then(response => {
			if (response.data && response.data) {
				setEvents(response.data.data);
			}
		});
	}, [dispatch]);


	useEffect(() => {
		axios.get('/referralSetting').then(response => {
			if (response.data && response.data) {
				setreferalSetting(response.data.data.referralSetting);
			}
		});
	}, [dispatch]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		console.log(model);
			axios.post('/updateReferralSetting',
			{ 
				"referralSetting":[ {
				  "event": model.event,
				  "amount": model.amount
				}]
			}).then(response => {
					setreferalSetting([ {
						"event": model.event,
						"amount": model.amount
					  }]);
			});
	}



	if (settings.loading) {
		return <FuseLoading />;
	}

	if (!settings.data) {
		return null;
	}

	console.log(settings);
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
											<Typography className=" text-18 font-300">Settings List</Typography>
											{/* <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8">
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
										</Paper> */}
										</div>
									</FuseAnimate>

									<FuseAnimateGroup
										className="flex flex-wrap"
										enter={{
											animation: 'transition.slideUpBigIn'
										}}
									>
										<div className="widget flex w-full p-12">
											<Widget11 data={settings.data} />
										</div>
									</FuseAnimateGroup>

									<FuseAnimate delay={600}>
										<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
											<Typography className=" text-18 font-300">App APK</Typography>
											<div className="flex flex-row self-end max-w-512 ">
												<div className="ml-8">
													<Button
														variant="contained"
														color="secondary"
														startIcon={<AddBox />}
														onClick={() => setOpen(true)}
													>
														Upload
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
											<AppListTable
												data={settings.appListData}
												editFn={ob =>
													dispatch(
														Actions.editSupportedVersion({
															_id: settings.appListData[0]._id,
															supportedVersion: ob
														})
													)
												}
												deleteFn={ob => dispatch(Actions.deletePrizeConfig(ob))}
											/>
										</div>
									</FuseAnimateGroup>

									<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
										<Typography className=" text-18 font-300">Current Referal settings</Typography>
									</div>

									{referalSetting && referalSetting.length ? (
										<div>
											<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
												<Typography className=" text-14 font-300">Event: {referalSetting[0].event}</Typography>
											</div>
											<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
												<Typography className=" text-14 font-300">Amount: {referalSetting[0].amount}</Typography>
											</div>
										</div>

									) : (
											<div className="flex justify-between flex-row min-w-0 p-16 pb-8">

												<Typography className=" text-14 font-300">No Referal settings found. </Typography>
											</div>

										)}


									<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
										<Typography className=" text-18 font-300">Update Referal settings</Typography>

									</div>
									<div className="widget flex w-full p-12">
										<Formsy
											onValidSubmit={handleSubmit}
											onValid={enableButton}
											// onInvalid={disableButton}
											// ref={formRef}
											className="flex flex-col justify-center w-full"
										>

											<SelectFormsy className="mb-16" name="event" label="Event" variant="outlined" required>
												{events && events.map(({ event }) => {
													return (
														<MenuItem key={event} value={event}>
															{event}
														</MenuItem>
													);
												})}
											</SelectFormsy>

											<TextFieldFormsy
												className="mb-16"
												type="number"
												name="amount"
												label="Amount"
												variant="outlined"
												required
											/>


											<Button
												type="submit"
												variant="contained"
												color="primary"
												// className="w-full mx-auto mt-16 normal-case blue-ios-button"
												aria-label="Save"
												disabled={!isFormValid}
												value="legacy"
											>
												Update
				</Button>
										</Formsy>
									</div>

									{/* <FuseAnimate delay={600}>
										<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
											<Typography className=" text-18 font-300">
												Prize Distribution Config
											</Typography>
											<div className="flex flex-row self-end max-w-512 ">
												<div className="ml-8">
													<Button
														variant="contained"
														color="secondary"
														startIcon={<AddBox />}
														onClick={() => dispatch(Actions.openNewPrizeConfigDialog())}
													>
														Add
													</Button>
												</div>
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
											<PrizeConfigTable
												data={settings.prizeConfigData}
												editFn={ob => dispatch(Actions.openEditPrizeConfigDialog(ob))}
												deleteFn={ob => dispatch(Actions.deletePrizeConfig(ob))}
											/>
										</div>
									</FuseAnimateGroup> */}
								</div>
							</div>
						</FuseAnimate>
					</div>
				}
				ref={pageLayout}
			/>

			<PrizeConfigDialog />
			<AppUploadDialog open={open} setOpen={setOpen} />
		</>
	);
}

export default withReducer('settingsPage', reducer)(SettingsPage);
