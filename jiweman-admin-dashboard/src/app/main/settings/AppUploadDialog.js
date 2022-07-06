import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import Axios from 'axios';
const defaultFormState = {
	position: 1,
	allocation: []
};

function AppUploadDialog({ open, setOpen }) {
	const handleClose = () => {
		setOpen(false);
	};

	const dispatch = useDispatch();
	const appUploadDialog = useSelector(({ settingsPage }) => settingsPage.settings.appUploadDialog);
	const [appVersion, setAppVersion] = useState('');
	const [supportedVersion, setSupportedVersion] = useState('');
	const [gameApk, setGameApk] = useState('');
	function closeAppUploadDialog() {
		// return appUploadDialog.type === 'edit'
		// 	? dispatch(Actions.closeEditAppUploadDialog())
		// 	: dispatch(Actions.closeNewAppUploadDialog());
		setOpen(false);
	}

	const handleAddEditPrizeConfig = async event => {
		//
		// appUploadDialog.type === 'edit'
		// 	? dispatch(Actions.editPrizeConfig(req))
		// 	: dispatch(Actions.addPrizeConfig(req));

		const url = '/settings/uploadApk';
		const formData = new FormData();
		formData.append('gameApk', gameApk);
		formData.append('appVersion', appVersion);
		formData.append('supportedVersion', supportedVersion);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};
		let data = await Axios.post(url, formData, config);
		// console.log();
		if (data.status === 200) {
			closeAppUploadDialog();
			dispatch(Actions.getAppList());
		}
	};

	const handleFileChange = e => {
		setGameApk(e.target.files[0]);
	};

	return (
		<Dialog
			open={open}
			onClose={closeAppUploadDialog}
			fullWidth
			maxWidth="md"
			disableBackdropClick={true}
			// disableEscapeKeyDown="true"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						Upload
					</Typography>
					<IconButton aria-label="close" color="inherit" onClick={closeAppUploadDialog}>
						<CloseIcon color="inherit" />
					</IconButton>
				</Toolbar>
			</AppBar>

			<form
				onSubmit={event => {
					event.preventDefault();
					handleAddEditPrizeConfig(event);
				}}
			>
				<DialogContent classes={{ root: 'p-0' }}>
					<div className="px-16 pt-16 sm:px-24">
						<div className="flex py-8">
							<FormControl className="px-4" required fullWidth>
								<TextField
									label="App Version"
									name="appVersion"
									type="number"
									value={appVersion}
									onChange={event => {
										// handleNumberOfPrizeChange(event);
										setAppVersion(event.target.value);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl className="px-4" required fullWidth>
								<TextField
									label="Supported Version"
									name="supportedVersion"
									type="number"
									value={supportedVersion}
									onChange={event => {
										// handleNumberOfPrizeChange(event);
										setSupportedVersion(event.target.value);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>
						<div className="pb-8 px-8">
							<input type="file" onChange={handleFileChange} multiple={false} />
						</div>
					</div>
				</DialogContent>

				<DialogActions className="justify-between px-8 py-16">
					<div className="px-16 flex-row flex w-full justify-between">
						<button type="submit" disabled style={{ display: 'none' }} aria-hidden="true"></button>
						<Button
							variant="contained"
							color="primary"
							// onClick={() => {
							// 	handleAddEditPrizeConfig();
							// }}
							// disabled={!canBeSubmitted()}
							type="submit"
						>
							Add
						</Button>
						<Typography className=" text-18 font-400">*All Fields are Mandatory</Typography>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default AppUploadDialog;
