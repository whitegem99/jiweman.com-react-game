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
import { debounce, find } from "lodash";
import Countries from '../register/tabs/Countries';

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
		return wallet.wallet.transferDialog;
	});
	const user = useSelector(({ auth }) => auth.user);
	const walletCurrency = useSelector(({ wallet }) => wallet.wallet.walletCurrency);
	const [amount, setAmount] = useState('');
	const [paymentAmount, setPaymentAmount] = useState(0);
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
	const [amountLoading, setAmountLoading] = useState(false)
	const handler = useCallback(debounce(getPaymentAmount, 500), []);
	const classes = useStyles();
	const [pgCharges, setPgCharges] = useState(0);
	const [networkCharges, setNetworkCharges] = useState(0);
	const [supportedNetworks, setSupportedNetworks] = useState('');
	const [transferCount, setTransferCount] = useState(0)

	const requestPayment = async () => {
		// Make the payment collection API call
		setIsDisabled(true);
		const reqBody = {
			phoneNumber,
			amount,
			first_name,
			last_name
		};

		axios
			.post('/wallet/transferToBank', reqBody)
			.then(response => {
				// console.log(response, response.data.status);
				if (response.data.status) {
					dispatch(
						MessageActions.showMessage({
							message: 'Transfer Initiated. Please check back later!', //text or html
							autoHideDuration: 6000, //ms
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'success' //success error info warning null
						})
					);
					closeDialog();
				}else{
					dispatch(
						MessageActions.showMessage({
							message: response.data.message,
							autoHideDuration: 6000, 
							anchorOrigin: {
								vertical: 'top', //top bottom
								horizontal: 'right' //left center right
							},
							variant: 'error'
						})
					);

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
		setAmount('');
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
		setPaymentAmount(0);
		setNetworkCharges(0)
		setPgCharges(0);
		const found = find(Countries, (ob) => {
			return ob.name === user.data.countryOfRecidence;
		});
		if (found) {
			setSupportedNetworks(found.supportedNetworks);
		}

		getTransferCount();
	};

	function getPaymentAmount(amount) {
		axios
			.post('/wallet/transferToBankAmount', {
				amount
			})
			.then(response => {
				if (response.data && response.data.status === true) {
					setPaymentAmount(response.data.data.amountAfterCharges);
					setNetworkCharges(response.data.data.networkCharges)
					setPgCharges(response.data.data.pgPaymentCharges)
				}
			}).finally(() => {
				setAmountLoading(false);
			});
	};

	function getTransferCount(amount) {
		setTransferCount(0);
		axios
			.get('/wallet/transferCount')
			.then(response => {
				if (response.data) {

					setTransferCount(response.data.length)
				}
			});
	};

	const handleAmountChange = event => {
		var mystring = Math.abs(event.target.value);
		setAmount(mystring);
		setAmountLoading(true);
		handler(mystring ? mystring : 0);
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'new'
		 */
		if (transferDialog.type === 'new') {
			handleReset();
			// getPhoneNumberList(transferDialog.data.league._id);

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
		dispatch(Actions.closeTransferDialog());
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function sendEmailOTP() {
		// setIsOTPSent(true);

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
		// setIsOTPVerified(true);
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
						Transfer Process
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				{transferCount === 0 ? <div className="px-16 sm:px-24 flex flex-col">
					<Typography className="py-16 text-18 font-500">
						To complete the transfer, please provide your Name, Phone Number
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
							id="amount"
							label="Amount to transfer"
							helperText={'Enter the amount you want to transfer. Minimum 25 ' + walletCurrency}
							value={amount}
							onChange={handleAmountChange}
							required={true}
							type="number"
							variant="outlined"
							className="w-full mt-12"
							inputProps={
								{
									min: 25
								}
							}
							// validations={{
							// 	min: 25
							// }}
							// validationErrors={{
							// 	min: 'Min 25' + walletCurrency
							// }}
							name="amount"
						// disabled={paymentStatus !== ''}
						/>
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

								value={phoneNumber}
								onChange={event => setPhoneNumber(event.target.value)}
								required={true}
								// type="number"
								variant="outlined"
								className="w-full mt-12"
								validations={{
									minLength: 11,
									equalsField: 'phoneNumberConfirm'
								}}
								validationErrors={{
									minLength: 'Please enter valid phone number',
									equalsField: 'Phone Number do not match'
								}}
								name="phoneNumberField"
								//disabled={paymentStatus !== ''}
								disabled={isOTPSent}
							/>
							<TextFieldFormsy
								id="account-number-confirm"
								label="Confirm Phone number"
								value={phoneNumberConfirm}
								onChange={event => setPhoneNumberConfirm(event.target.value)}
								required={true}
								// type="number"
								variant="outlined"
								className="w-full mt-12 ml-12"
								validations={{
									minLength: 11,
									equalsField: 'phoneNumberField'
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
						<Typography color="textSecondary">{'Mobile no with Country Code. Ex +80000000123.' + ' Supported: ' + supportedNetworks}</Typography>

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

						<div className="flex flex-col space-between full-width items-end py-24">
							<Typography Typography color="textSecondary" className="font-medium">
								Includes Deduction for PG Charges: {pgCharges} {' '}
								{walletCurrency} | Network Charges: {networkCharges} {' '}
								{walletCurrency}
							</Typography>


							<div className={clsx('flex self-end')}>
								{isDisabled && <CircularProgress />}
								<Button
									variant="contained"
									type="submit"
									color="primary"
									// onClick={requestPayment}
									className={clsx(classes.button, 'ml-16 flex self-end')}
									// disabled={phoneNumber === '' || first_name === '' || last_name === '' || isDisabled}
									disabled={!isFormValid || (phoneNumber !== originalPhoneNumber && !isOTPVerified) || amountLoading || isDisabled || paymentAmount < 25}
								>
									Transfer | {amountLoading ? 'Calculating...' : paymentAmount + ' ' + walletCurrency}
								</Button>
							</div>
						</div>
					</Formsy>
				</div> : <Typography className="py-16 text-18 font-500 text-center">Only One Transfer Allowed in 24hours</Typography>
				}</DialogContent>

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
