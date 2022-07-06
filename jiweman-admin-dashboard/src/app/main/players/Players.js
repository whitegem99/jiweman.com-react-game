import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Icon, Input, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import TableWidget from './widgets/TableWidget';

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

function PlayersPage(props) {
	const dispatch = useDispatch();
	const players = useSelector(({ playersPage }) => playersPage.players);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [searchText, setSearchText] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null)
	const [selectedWarnUser, setWarnSelectedUser] = useState(null)
	const [open, setOpen] = React.useState(false);
	const [openWarn, setWarnOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		dispatch(Actions.getPlayers());
	}, [dispatch]);

	if (players.loading) {
		return <FuseLoading />;
	}

	if (!players.data) {
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
									<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
										<Typography className=" text-18 font-300">List of your players</Typography>
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
									</div>
								</FuseAnimate>

								<FuseAnimateGroup
									className="flex flex-wrap"
									enter={{
										animation: 'transition.slideUpBigIn'
									}}
								>
									<div className="widget flex w-full p-12">
										<TableWidget text={searchText} data={players.data}
											banFn={(ob) => {
												setOpen(true)
												setSelectedUser(ob)
											}}
											unBanFn={
												(ob) => {
													dispatch(Actions.banPlayer(ob._id, false, ''))
												}
											}
											warnFn={(ob) => {
												setWarnOpen(true)
												setWarnSelectedUser(ob)
											}}
										/>
									</div>
								</FuseAnimateGroup>
							</div>
						</div>
					</FuseAnimate>
					<BanDialog user={null} open={open} setOpen={setOpen} banFn={(reason) => {
						if (selectedUser) {
							dispatch(Actions.banPlayer(selectedUser._id, true, reason))
						}

					}}></BanDialog>
					<WarnDialog user={null} openWarn={openWarn} setWarnOpen={setWarnOpen} warnFn={(warnReason) => {
						if (selectedWarnUser) {
							dispatch(Actions.warnPlayer(selectedWarnUser._id, warnReason))
						}

					}}></WarnDialog>
				</div>
			}
			ref={pageLayout}
		/>
	);
}

export default withReducer('playersPage', reducer)(PlayersPage);

function BanDialog(props) {
	const { open, setOpen, banFn } = props;
	const { user } = props;
	const [reason, setReason] = useState(null);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		banFn(reason)
		setOpen(false);
		setReason(null);
	};

	const handleCancel = () => {
		setReason(null);
		setOpen(false);
	}

	return (
		<div>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
				Open form dialog
		</Button> */}
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Ban User?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the reason for banning the user. It will help you remind back why was this user banned.
			</DialogContentText>
					<TextField
						value={reason}
						autoFocus
						margin="dense"
						id="name"
						label="Reason"
						fullWidth
						onChange={
							(ev) => {
								setReason(ev.target.value)
							}
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancel} color="primary">
						Cancel
			</Button>
					<Button onClick={handleClose} color="primary">
						Ban
			</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}


function WarnDialog(props) {
	const { openWarn, setWarnOpen, warnFn } = props;
	const [warnReason, selectedWarnUser] = useState(null);
	const handleClickOpen = () => {
		setWarnOpen(true);
	};

	const handleClose = () => {
		warnFn(warnReason)
		setWarnOpen(false);
		selectedWarnUser(null);
	};

	const handleCancel = () => {
		selectedWarnUser(null);
		setWarnOpen(false);
	}

	return (
		<div>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
				Open form dialog
		</Button> */}
			<Dialog open={openWarn} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Warn User?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter the reason for warning the user. It will help us to track.
			</DialogContentText>
					<TextField
						value={warnReason}
						autoFocus
						margin="dense"
						id="name"
						label="Reason"
						fullWidth
						onChange={
							(ev) => {
								selectedWarnUser(ev.target.value)
							}
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancel} color="primary">
						Cancel
			</Button>
					<Button onClick={handleClose} color="primary">
						Warn
			</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
