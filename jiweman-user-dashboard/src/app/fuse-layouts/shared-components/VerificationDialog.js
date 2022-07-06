import { useForm } from '@fuse/hooks';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as authActions from 'app/auth/store/actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import Axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';

// import FuseLoading from '@fuse/core/FuseLoading';

// const defaultFormState = {};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	actionsContainer: {
		marginBottom: theme.spacing(2)
	},
	resetContainer: {
		padding: theme.spacing(3)
	},
	dialogPaper: {
		// minHeight: '50vh'
		// maxHeight: '50vh'
	}
}));

const defaultFormState = {
	id_type: '',
	id_number: '',
	url: '',
	selfie: ''
};

function VerificationDialog(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const verificationDialog = useSelector(({ auth }) => auth.user.verificationDialog);
	const user = useSelector(({ auth }) => auth.user);
	console.log(user)
	const { form, handleChange, setForm } = useForm({ ...defaultFormState });
	const [uploading, setUploading] = useState(false);

	const webcamRef = React.useRef(null);
	const [imgSrc, setImgSrc] = React.useState(null);

	const capture = React.useCallback(async () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setImgSrc(imageSrc);
		const files = {
			base64: imageSrc,
			file: {},
			name: `selfie_${user.data._id}.jpeg`,
			size: "200 kB",
			type: "image/jpeg",
		}
		let { data: uploadResponse } = await Axios.post('/uploadUserData', files);

		setForm({
			...form,
			selfie: uploadResponse.url
		});

		// setForm({
		// 	...form,
		// 	selfie: imageSrc
		// })
	}, [webcamRef, setImgSrc, setForm, form]);



	const requestPayment = async () => {
		// Make the payment collection API call

		Axios.post('/userVerification', form)
			.then(response => {
				console.log(response, response.data.status);
				dispatch(
					MessageActions.showMessage({
						message: 'Submitted Successfully...', //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
				closeDialog();
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleReset = () => {
		setForm({
			...defaultFormState
		});
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'new'
		 */
		if (verificationDialog.type === 'new') {
			handleReset();
		}
		// eslint-disable-next-line
	}, [verificationDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (verificationDialog.props.open) {
			initDialog();
		}
	}, [verificationDialog.props.open, initDialog]);

	function closeDialog() {
		dispatch(authActions.closeVerificationDialog());
	}
	const handleFileChange = e => {
		// get the files
		let files = e.target.files;

		// Process each file
		var allFiles = [];
		for (var i = 0; i < files.length; i++) {
			let file = files[i];

			// Make new FileReader
			let reader = new FileReader();

			// Convert the file to base64 text
			reader.readAsDataURL(file);

			// on reader load somthing...
			reader.onload = () => {
				// Make a fileInfo Object
				let fileInfo = {
					name: file.name,
					type: file.type,
					size: Math.round(file.size / 1000) + ' kB',
					base64: reader.result,
					file: file
				};

				// Push it to the state
				allFiles.push(fileInfo);

				// If all files have been proceed
				if (allFiles.length === files.length) {
					// Apply Callback function
					if (false) {
						getFiles(allFiles);
					} else {
						getFiles(allFiles[0]);
					}
				}
			}; // reader.onload
		} // for
	};

	const getFiles = async files => {
		setUploading(true);
		let { data: uploadResponse } = await Axios.post('/uploadUserData', files);

		setForm({
			...form,
			url: uploadResponse.url
		});
		setUploading(false);
	};

	const isNotValid = () => {
		if (form.id_number === '' || form.id_type === '' || form.url === '') {
			return false;
		}
		return true;
	};

	return (
		<Dialog
			{...verificationDialog.props}
			onClose={closeDialog}
			// fullWidth
			maxWidth="sm"
			classes={{ paper: classes.dialogPaper }}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Add Verification Details
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				<div className="px-16 sm:px-24 flex flex-col">
					<Typography className="py-16 text-18 font-500">
						To complete the verification, please provide a valid ID proof.
					</Typography>

					<div className="flex py-12">

						<FormControl className="px-8" variant="outlined" required fullWidth>
							<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-country">
								ID Type
								</InputLabel>
							<Select
								value={form.id_type}
								labelId="demo-simple-select-outlined-label-country"
								id="demo-simple-select-outlined-country"
								onChange={handleChange}
								required
								label="Eligible Countries"
								name="id_type"
							>
								{[
									{ name: 'Driving License' },
									{ name: 'National ID' },
									{ name: 'Passport' },

								].map(({ name }) => (
									<MenuItem value={name}>{name}</MenuItem>
								))}
							</Select>
							{/* <FormHelperText>Without label</FormHelperText> */}
						</FormControl>
					</div>
					<div className="flex py-12">
						<FormControl className="px-8" required fullWidth>
							<TextField
								label="ID Number"
								name="id_number"
								value={form.id_number}
								onChange={handleChange}
								required
								variant="outlined"
							// inputProps={{
							// 	onCopy: 'return false',
							// 	onDrag: 'return false',
							// 	onDrop: 'return false',
							// 	onPaste: 'return false'
							// }}
							/>
						</FormControl>
					</div>

					<div className="pb-8 px-8">
						<Typography className="py-2 text-18 font-500">
							Upload ID Proof
					</Typography>
						<input type="file" onChange={handleFileChange} multiple={false} />
					</div>
					<div className="px-8">
						{uploading
							? 'Uploading file... Please wait...!!'
							: form.url === ''
								? ''
								: 'ID Proof Uploaded.'}
					</div>
					<div className="px-8">

						<Typography className="py-2 text-18 font-500">
							Upload Selfie
					</Typography>

						<div className="flex flex-row justify-center">

							{form.selfie !== '' ? (
								<div className="flex flex-col justify-center">
									<img id="Selfie"
										src={imgSrc}
									/>
									<Button variant="contained"
										onClick={() => {
											setForm({
												...form,
												selfie: ''
											})
										}}>Try Again</Button>
								</div>
							) :
								<div className="flex flex-col justify-center">
									<Webcam
										audio={false}
										ref={webcamRef}
										screenshotFormat="image/jpeg"
										id="Selfie"
										forceScreenshotSourceSize={true}
										videoConstraints={{
											facingMode: "user"
										}}
									/>
									<Button variant="contained"
										color="primary" onClick={capture}>Capture photo</Button>
								</div>}
						</div>




					</div>


				</div>
			</DialogContent>

			<DialogActions className="justify-end p-8">
				<div className="px-16">
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							closeDialog();
						}}
					>
						Close
					</Button>
				</div>
				<div className="p-8">
					<Button
						variant="contained"
						color="primary"
						onClick={requestPayment}
						className={clsx(classes.button, 'flex self-end')}
						disabled={form.id_number === '' || form.id_type === '' || form.url === '' || form.selfie === ''}
					>
						Submit For Verification
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}

export default VerificationDialog;
