import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { Chip, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useInterval from '@use-it/interval';
import axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import * as WalletActions from './../wallet/store/actions';
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

function PaymentDialog(props) {
	const dispatch = useDispatch();
	const paymentDialog = useSelector(({ leaguePage }) => leaguePage.payment.paymentDialog);
	const walletBalance = useSelector(({ leaguePage }) => leaguePage.wallet.walletBalance);
	const walletCurrency = useSelector(({ leaguePage }) => leaguePage.wallet.walletCurrency);

	// console.log(paymentDialog);
	// const user = useSelector(({ auth }) => auth.user);
	// const paymentCollection = useSelector(({ leaguePage }) => leaguePage.payment.paymentCollection);
	const [phonenumber, setPhonenumber] = useState('');
	const [phonenumberConfirm, setPhonenumberConfirm] = useState('');
	const classes = useStyles();
	const [paymentInitiatedData, setPaymentInitiatedData] = useState(null);
	const [paymentStatus, setPaymentStatus] = useState('');
	const [intervalDelay, setIntervalDelay] = useState(null);
	const [ticket, setTIcket] = useState(null);
	const [mode, setMode] = useState('wallet');
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [pgCharges, setPgCharges] = useState(0);
	const [networkCharges, setNetworkCharges] = useState(0);

	const payFromWallet = async () => {
		setPaymentStatus('pending');

		const reqBody = {
			mode: mode,
			leagueId: paymentDialog.data._id,
			amount: paymentDialog.data.localEntryFeeWithCommission,
			currency: paymentDialog.data.localCurrency
		};

		if (mode === 'walletFromPG') {
			reqBody.phonenumber = phonenumber;
		}

		axios
			.post('/purchaseLeague', reqBody)
			.then(response => {
				console.log(response, response.data, response.data.success);

				if (mode === 'wallet' && response.data.success) {
					setPaymentStatus('successful');
					setTIcket(response.data.data.ticket);
					dispatch(Actions.getLeague());
					dispatch(WalletActions.getWalletBalance());
				} else if (mode === 'walletFromPG') {
					setPaymentInitiatedData(response.data);
					setPaymentStatus(response.data.status);
					setIntervalDelay(6000);
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleReset = () => {
		setPhonenumber('');
		setPhonenumberConfirm('');
		setPaymentInitiatedData(null);
		setPaymentStatus('');
		setIntervalDelay(null);
		setTIcket(null);
		setMode('wallet');
		setPaymentAmount(0);
		setNetworkCharges(0)
		setPgCharges(0);
	};

	const handlePhoneNumberChange = event => {
		var mystring = event.target.value;
		mystring = mystring.replace('e', '');
		console.log(mystring);
		setPhonenumber(mystring);
	};

	const handlePhoneNumberChangeConfirm = event => {
		var mystring = event.target.value;
		mystring = mystring.replace('e', '');
		console.log(mystring);
		setPhonenumberConfirm(mystring);
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'new'
		 */
		if (paymentDialog.type === 'new') {
			handleReset();
		}
		// eslint-disable-next-line
	}, [paymentDialog.data, paymentDialog.type]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (paymentDialog.props.open) {
			initDialog();
			dispatch(WalletActions.getWalletBalance());
		}
	}, [paymentDialog.props.open, initDialog]);

	useEffect(() => {
		if (paymentDialog.data && paymentDialog.data.localEntryFeeWithCommission) {
			getPaymentAmount(paymentDialog.data.localEntryFeeWithCommission);
		}
	}, [paymentDialog.data]);

	function closePaymentDialog() {
		dispatch(Actions.closePaymentDialog());
	}

	const [count, setCount] = useState(0);

	const getPaymentStatus = () => {
		axios.get('/collections/status/' + paymentInitiatedData.id).then(response => {
			if (response.data && response.data.status === 'successful') {
				setPaymentStatus('successful');
				setTIcket(response.data.ticket);
				dispatch(Actions.getLeague());
				dispatch(WalletActions.getWalletBalance());
			}
		});
	};

	const getPaymentAmount = amount => {
		axios
			.post('/wallet/addToWalletAmount', {
				amount
			})
			.then(response => {
				if (response.data && response.data.status === true) {
					setPaymentAmount(response.data.data.amountAfterCharges);
					setNetworkCharges(response.data.data.networkCharges)
					setPgCharges(response.data.data.pgCharges)
				}
			});
	};

	useInterval(() => {
		if (paymentStatus === 'successful') {
			setIntervalDelay(null);
		}

		if (count < 30) {
			setCount(currentCount => currentCount + 1);
			getPaymentStatus();
		} else {
			setIntervalDelay(null);
		}
	}, intervalDelay);

	if (!paymentDialog.data) {
		// return <FuseLoading />;
		return <span></span>;
	}

	return (
		<Dialog
			{...paymentDialog.props}
			onClose={closePaymentDialog}
			fullWidth
			maxWidth="sm"
			classes={{ paper: classes.dialogPaper }}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Payment Process
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				<div className="px-16 sm:px-24 flex flex-col">
					<Typography className="py-16 text-18 font-500">
						To complete the payment, please choose an option.
					</Typography>
					<FormControl component="fieldset" disabled={paymentStatus !== ''}>
						<FormLabel component="legend">Mode</FormLabel>
						<RadioGroup
							aria-label="mode"
							name="mode"
							value={mode}
							onChange={ev => setMode(ev.target.value)}
						>
							<FormControlLabel
								value="wallet"
								control={<Radio />}
								label={'Wallet (' + walletBalance + ' ' + walletCurrency + ')'}
							/>
							<FormControlLabel
								value="walletFromPG"
								control={<Radio />}
								label="Add To Wallet &amp; Pay"
							/>
						</RadioGroup>
					</FormControl>
					{mode === 'walletFromPG' ? (
						<>
							<TextField
								id="account-number"
								label="Phone number"
								helperText={
									'Mobile no with Country Code. Ex +80000000123. Only Supports: ' +
									paymentDialog.data.supportedNetworks
								}
								value={phonenumber}
								onChange={handlePhoneNumberChange}
								required={true}
								type="number"
								variant="outlined"
								className="w-full"
								disabled={paymentStatus !== ''}
							// InputProps={{
							// 	onKeyDown: event => event.keyCode !== 69
							// }}
							/>
							<TextField
								id="account-number"
								label="Confirm Phone number"
								helperText={'Confirm Mobile No.'}
								value={phonenumberConfirm}
								onChange={handlePhoneNumberChangeConfirm}
								required={true}
								type="number"
								variant="outlined"
								className="w-full mt-12"
								disabled={paymentStatus !== ''}
							// InputProps={{
							// 	onKeyDown: event => event.keyCode !== 69
							// }}
							/>
							<div className="flex flex-col space-between full-width items-end">
								<Typography Typography color="textSecondary" className="font-medium">
									Including PG Charges: {pgCharges} {' '}
									{paymentDialog.data.localCurrency} | Network Charges: {networkCharges} {' '}
									{paymentDialog.data.localCurrency}
								</Typography>
								<Button
									variant="contained"
									color="primary"
									onClick={payFromWallet}
									className={clsx(classes.button, 'flex self-end')}
									disabled={
										phonenumber === '' || phonenumber !== phonenumberConfirm || paymentStatus !== ''
									}
								>
									Initiate Payment | {paymentAmount}{' '}
									{paymentDialog.data.localCurrency}
								</Button>
							</div>
						</>
					) : (


							<Button
								variant="contained"
								color="primary"
								onClick={payFromWallet}
								className={clsx(classes.button, 'flex self-end')}
								disabled={
									walletBalance < paymentDialog.data.localEntryFeeWithCommission || paymentStatus !== ''
								}
							>
								Initiate Payment | {paymentDialog.data.localEntryFeeWithCommission}{' '}
								{paymentDialog.data.localCurrency}
							</Button>

						)}

					{paymentStatus === 'pending' ? (
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
					) : paymentStatus === 'failed' ? (
						<div className="flex justify-center m-16">
							<FuseAnimateGroup animation="transition.slideUpIn" className="justify-center">
								<div className="flex flex-row items-center">
									<div className="p-16">
										<Typography className="text-18 font-300">
											Your payment failed...! Please close and try again.
										</Typography>
									</div>
								</div>
							</FuseAnimateGroup>
						</div>
					) : (
								<></>
							)}
				</div>
			</DialogContent>

			<DialogActions className="justify-end p-8">
				<div className="px-16">
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							closePaymentDialog();
						}}
					>
						Close
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}

export default PaymentDialog;
