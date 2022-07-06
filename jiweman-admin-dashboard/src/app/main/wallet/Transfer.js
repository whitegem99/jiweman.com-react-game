import { TextFieldFormsy } from '@fuse/core/formsy';
import { CircularProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import axios from 'axios';
import clsx from 'clsx';
import Formsy from 'formsy-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';

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

function TransferDialog(props) {
	const dispatch = useDispatch();
	const transferDialog = useSelector(({ wallet }) => {
		// console.log(winningsPage);
		return wallet.wallet.transferDialog;
	});
	const [phoneNumber, setPhoneNumber] = useState('');
	const [phoneNumberConfirm, setPhoneNumberConfirm] = useState('');
	const [oneTimePassword, setOneTimePassword] = useState('');
	const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
	const [first_name, setFirst_name] = useState('');
	const [last_name, setLast_name] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	const [previousNumbers, setPreviousNumbers] = useState([]);
	const [isFormValid, setIsFormValid] = useState(false);
	const [isOTPSent, setIsOTPSent] = useState(false);
	const [isOTPVerified, setIsOTPVerified] = useState(false);
	const classes = useStyles();

	const requestPayment = async () => {
		// Make the payment collection API call
		setIsDisabled(true);
		const reqBody = {
			phoneNumber,
			winningId: transferDialog.data._id,
			first_name,
			last_name
		};

		axios
			.post('/auth/claimLeagueWinning', reqBody)
			.then(response => {
				// console.log(response, response.data.status);
				if (response.data.status) {
					dispatch(
						MessageActions.showMessage({
							message: 'Claim Initiated. Please check back later!', //text or html
							autoHideDuration: 6000, //ms
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'success' //success error info warning null
						})
					);
					closeDialog();
				}
			})
			.catch(error => {
				if (error.response) {
					dispatch(
						MessageActions.showMessage({
							message: error.response.data.message, //text or html
							autoHideDuration: 6000, //ms
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'error' //success error info warning null
						})
					);
				}
			})
			.finally(() => {
				setIsDisabled(false);
			});
	};

	const handleReset = () => {
		setPhoneNumber('');
		setPhoneNumberConfirm('');
		setFirst_name('');
		setLast_name('');
		setPreviousNumbers(null);
		setIsDisabled(false);
		setIsOTPSent(false);
		setOriginalPhoneNumber('');
		setIsOTPVerified(false);
		setOneTimePassword('');
	};

	// const handlePhoneSelection = ob => {
	// 	setPhoneNumber(ob.phone_number);
	// 	setFirst_name(ob.first_name);
	// 	setLast_name(ob.last_name);
	// };

	const getPhoneNumberList = leagueId => {
		axios.get('/auth/playerPhoneNumberFromLeaguePurchase/' + leagueId).then(response => {
			if (response.data.data) {
				setOriginalPhoneNumber(response.data.data && response.data.data.phoneNumber);
				setPhoneNumber(response.data.data && response.data.data.phoneNumber);
			}
		});
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'new'
		 */
		if (transferDialog.type === 'new') {
			handleReset();
			getPhoneNumberList(transferDialog.data.league._id);

			console.log(transferDialog);
		}
		// eslint-disable-next-line
	}, [transferDialog.data, transferDialog.type]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (transferDialog.props.open) {
			initDialog();
		}
	}, [transferDialog.props.open, initDialog]);

	function closeDialog() {
		dispatch(Actions.closeWinningDialog());
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function sendEmailOTP() {
		axios
			.post('/auth/mobileNumberVerification', {
				mobileNumber: phoneNumber
			})
			.then(response => {
				console.log(response);
				if (response.data.status) {
					setIsOTPSent(true);
					dispatch(
						MessageActions.showMessage({
							message: response.data.message,
							autoHideDuration: 6000, //ms
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'success' //success error info warning null
						})
					);
				}
			});
	}

	function verifyOTP() {
		axios
			.post('/auth/verifyMobileNumber', {
				mobileNumber: phoneNumber,
				otp: oneTimePassword
			})
			.then(response => {
				console.log(response);
				if (response.data.status) {
					setIsOTPVerified(true);
					dispatch(
						MessageActions.showMessage({
							message: 'Verified...',
							autoHideDuration: 6000, //ms
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'success' //success error info warning null
						})
					);
				} else {
					dispatch(
						MessageActions.showMessage({
							message: 'Invalid OTP...',
							autoHideDuration: 6000, //ms
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'error' //success error info warning null
						})
					);
				}
			})
			.catch(err => {
				dispatch(
					MessageActions.showMessage({
						message: 'Invalid OTP...',
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'error' //success error info warning null
					})
				);
			});
	}

	return (
		<Dialog
			{...transferDialog.props}
			onClose={closeDialog}
			fullWidth
			maxWidth="sm"
			classes={{ paper: classes.dialogPaper }}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Claim Process
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				<div className="px-16 sm:px-24 flex flex-col">
					<Typography className="py-16 text-18 font-500">
						To complete the claim, please provide your Name, Phone Number
					</Typography>

					{/* {previousNumbers.length && (
						<div>
							<List
								dense={true}
								subheader={
									<ListSubheader component="span" id="nested-list-subheader">
										Your Previously Used Numbers (Click to re-use)
									</ListSubheader>
								}
								component="nav"
								aria-label="main mailbox folders"
							>
								{previousNumbers.map((ob, key) => (
									<ListItem button key={key} onClick={() => handlePhoneSelection(ob)}>
										<ListItemText
											primary={ob.first_name + ' ' + ob.last_name}
											secondary={ob.phone_number}
										/>
									</ListItem>
								))}
							</List>
						</div>
					)} */}
					<Formsy
						onValidSubmit={requestPayment}
						onValid={enableButton}
						onInvalid={disableButton}
						// ref={formRef}
						className="flex flex-col justify-center w-full"
					>
						<TextFieldFormsy
							id="first-name"
							label="First Name"
							helperText="As per your mobile network"
							value={first_name}
							onChange={event => setFirst_name(event.target.value)}
							required={true}
							// type="number"
							variant="outlined"
							className="w-full mt-12"
							validations={{
								minLength: 4
							}}
							validationErrors={{
								minLength: 'Min character length is 4'
							}}
							name="firstName"
							// disabled={paymentStatus !== ''}
						/>
						<TextFieldFormsy
							id="last-name"
							label="Last Name"
							helperText="As per your mobile network"
							value={last_name}
							onChange={event => setLast_name(event.target.value)}
							required={true}
							// type="number"
							variant="outlined"
							className="w-full mt-12"
							validations={{
								minLength: 4
							}}
							validationErrors={{
								minLength: 'Min character length is 4'
							}}
							name="lastName"
							// disabled={paymentStatus !== ''}
						/>

						<div className="flex flex-row w-full">
							<TextFieldFormsy
								id="account-number"
								label="Phone number"
								helperText="Mobile no with Country Code. Ex +80000000123"
								value={phoneNumber}
								onChange={event => setPhoneNumber(event.target.value)}
								required={true}
								// type="number"
								variant="outlined"
								className="w-full mt-12"
								validations={{
									minLength: 11
								}}
								validationErrors={{
									minLength: 'Please enter valid phone number'
								}}
								name="phoneNumber"
								//disabled={paymentStatus !== ''}
								disabled={isOTPSent}
							/>
							<TextFieldFormsy
								id="account-number-confirm"
								label="Confirm Phone number"
								helperText="Confirm your mobile"
								value={phoneNumberConfirm}
								onChange={event => setPhoneNumberConfirm(event.target.value)}
								required={true}
								// type="number"
								variant="outlined"
								className="w-full mt-12 ml-12"
								validations={{
									minLength: 11,
									equalsField: 'phoneNumber'
								}}
								validationErrors={{
									minLength: 'Please enter valid phone number',
									equalsField: 'Phone Number do not match'
								}}
								name="phoneNumberConfirm"
								//disabled={paymentStatus !== ''}
								disabled={isOTPSent}
							/>

							{phoneNumber !== originalPhoneNumber ? (
								<Button
									variant="contained"
									color="primary"
									className={clsx(classes.button, 'ml-16 my-12 flex self-end w-1/3')}
									onClick={() => {
										sendEmailOTP();
									}}
									disabled={isOTPSent}
								>
									Send OTP
								</Button>
							) : (
								<></>
							)}
						</div>

						{isOTPSent && (
							<div className="flex flex-row w-full">
								<TextFieldFormsy
									id="otp-number"
									label="Enter OTP"
									value={oneTimePassword}
									onChange={event => setOneTimePassword(event.target.value)}
									required={true}
									// type="number"
									variant="outlined"
									className="w-full mt-12"
									validations={{
										minLength: 4
									}}
									validationErrors={{
										minLength: 'Please enter OTP'
									}}
									name="phoneNumber"
									//disabled={paymentStatus !== ''}
									disabled={isOTPVerified}
								/>

								<Button
									variant="contained"
									color="primary"
									className={clsx(classes.button, 'ml-16 my-12 flex self-end w-1/3')}
									onClick={() => {
										verifyOTP();
									}}
									disabled={isOTPVerified}
								>
									Verify
								</Button>
							</div>
						)}

						<div className={clsx('flex self-end py-24')}>
							{isDisabled && <CircularProgress />}
							<Button
								variant="contained"
								type="submit"
								color="primary"
								// onClick={requestPayment}
								className={clsx(classes.button, 'ml-16 flex self-end')}
								// disabled={phoneNumber === '' || first_name === '' || last_name === '' || isDisabled}
								disabled={!isFormValid || (phoneNumber !== originalPhoneNumber && !isOTPVerified)}
							>
								Initiate Claim
							</Button>
						</div>
					</Formsy>
					{/* {paymentStatus === 'pending' ? (
						<div className="flex justify-center m-16">
							<FuseAnimateGroup animation="transition.slideUpIn" className="justify-center">
								<Typography className="py-16 text-18 font-300">
									Please complete your payment on the phone.
								</Typography>
								<div className="text-center">
									<CircularProgress color="secondary" />
								</div>
							</FuseAnimateGroup>
						</div>
					) : (
						<></>
					)}
					{paymentStatus === 'successful' ? (
						<div className="flex justify-center m-16">
							<FuseAnimateGroup animation="transition.slideUpIn" className="justify-center">
								<div className="flex flex-row items-center">
									<Icon color="action">done_all</Icon>
									<div className="p-16">
										<Typography className="text-18 font-300">
											Your payment is successful..!! Its game time :)
										</Typography>
										<Chip label={`League Ticket: ${ticket}`}> </Chip>
									</div>
								</div>
							</FuseAnimateGroup>
						</div>
					) : (
						<></>
					)} */}
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
			</DialogActions>
		</Dialog>
	);
}

export default TransferDialog;
