import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { Chip, CircularProgress } from '@material-ui/core';
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
import { debounce, find } from "lodash";
import FuseLoading from '@fuse/core/FuseLoading';
import Countries from '../register/tabs/Countries';


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
	const paymentDialog = useSelector(({ wallet }) => wallet.wallet.paymentDialog);
	const walletCurrency = useSelector(({ wallet }) => wallet.wallet.walletCurrency);

	const user = useSelector(({ auth }) => auth.user);
	// const paymentCollection = useSelector(({ leaguePage }) => leaguePage.payment.paymentCollection);
	const [phonenumber, setPhonenumber] = useState('');
	const [phonenumberConfirm, setPhonenumberConfirm] = useState('');
	const classes = useStyles();
	const [paymentInitiatedData, setPaymentInitiatedData] = useState(null);
	const [paymentStatus, setPaymentStatus] = useState('');
	const [intervalDelay, setIntervalDelay] = useState(null);
	const [amount, setAmount] = useState(null);
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [amountLoading, setAmountLoading] = useState(false)
	const handler = useCallback(debounce(getPaymentAmount, 500), []);
	const [supportedNetworks, setSupportedNetworks] = useState('');
	const [pgCharges, setPgCharges] = useState(0);
	const [networkCharges, setNetworkCharges] = useState(0);

	const requestPayment = async () => {
		// Make the payment collection API call
		setPaymentStatus('pending');
		const collectionRequestBody = {
			phonenumber,
			amount,
			currency: walletCurrency
		};

		axios
			.post('/wallet/addToWallet', collectionRequestBody)
			.then(response => {
				// console.log(response, response.data.status);
				setPaymentInitiatedData(response.data);
				setPaymentStatus(response.data.status);
				setIntervalDelay(6000);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleReset = () => {
		setPhonenumber('');
		setPhonenumberConfirm('')
		setPaymentInitiatedData(null);
		setPaymentStatus('');
		setIntervalDelay(null);
		setAmount(null);
		setPaymentAmount(0);
		setNetworkCharges(0)
		setPgCharges(0);
		const found = find(Countries, (ob) => {
			return ob.name === user.data.countryOfRecidence;
		});
		if (found) {
			setSupportedNetworks(found.supportedNetworks);
		}
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

	const handleAmountChange = event => {
		var mystring = event.target.value;
		setAmount(mystring);
		setAmountLoading(true);
		handler(mystring ? mystring : 0);
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
		}
	}, [paymentDialog.props.open, initDialog]);

	function closePaymentDialog() {
		dispatch(Actions.closePaymentDialog());
	}

	const [count, setCount] = useState(0);

	const getPaymentStatus = () => {
		axios.get('/collections/status/' + paymentInitiatedData.id).then(response => {
			if (response.data && response.data.status === 'successful') {
				setPaymentStatus('successful');
				dispatch(Actions.getWalletHistory());
				dispatch(Actions.getWalletBalance());
			}
		});
	};

	function getPaymentAmount(amount) {
		axios.post('/wallet/addToWalletAmount', {
			amount
		}).then(response => {
			if (response.data && response.data.status === true) {
				setPaymentAmount(response.data.data.amountAfterCharges)
				setNetworkCharges(response.data.data.networkCharges)
				setPgCharges(response.data.data.pgCharges)
			}
		}).finally(() => {
			setAmountLoading(false);
		});
	};


	useInterval(() => {
		if (paymentStatus === 'successful') {
			setIntervalDelay(null);
		}

		if (count < 20) {
			setCount(currentCount => currentCount + 1);
			getPaymentStatus();
		} else {
			setIntervalDelay(null);
		}
	}, intervalDelay);

	// if (!paymentDialog.data) {
	// 	// return <FuseLoading />;
	// 	return <span></span>;
	// }

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
						Add Money To Wallet
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				<div className="px-16 sm:px-24 flex flex-col">
					<Typography className="py-16 text-18 font-500">
						To complete the payment, please provide your phone number
					</Typography>
					<TextField
						id="amount"
						label="Amount"
						helperText={'Enter the amount you want to add in the wallet. Minimum 25 ' + walletCurrency}
						value={amount}
						onChange={handleAmountChange}
						required={true}
						type="number"
						variant="outlined"
						className="w-full"
						disabled={paymentStatus !== ''}
						InputProps={{
							min: 25
						}}
					/>
					<TextField
						id="account-number"
						label="Phone number"
						helperText={'Mobile no with Country Code. Ex +80000000123.' + ' Supported: ' + supportedNetworks}
						value={phonenumber}
						onChange={handlePhoneNumberChange}
						required={true}
						type="number"
						variant="outlined"
						className="w-full mt-12"
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
							{walletCurrency} | Network Charges: {networkCharges} {' '}
							{walletCurrency}
						</Typography>
						<Button
							variant="contained"
							color="primary"
							onClick={requestPayment}
							className={clsx(classes.button, 'flex self-end')}
							disabled={phonenumber === '' || phonenumber !== phonenumberConfirm || paymentStatus !== '' || amount === '' || amount < 25 || amountLoading}
						>
							Initiate Payment | {amountLoading ? 'Calculating...' : paymentAmount + " " + walletCurrency}
						</Button>
					</div>
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
											Your payment is successful..!! Money Added to wallet :)
										</Typography>
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
