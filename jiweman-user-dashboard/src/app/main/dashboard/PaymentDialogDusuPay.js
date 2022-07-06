import FuseLoading from '@fuse/core/FuseLoading';
import { FormControlLabel, Radio, RadioGroup, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';

// const defaultFormState = {};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1)
	},
	actionsContainer: {
		marginBottom: theme.spacing(2)
	},
	resetContainer: {
		padding: theme.spacing(3)
	},
	dialogPaper: {
		minHeight: '80vh',
		maxHeight: '80vh'
	}
}));

function PaymentDialog(props) {
	const dispatch = useDispatch();
	const paymentDialog = useSelector(({ leaguePage }) => leaguePage.payment.paymentDialog);
	const paymentOptions = useSelector(({ leaguePage }) => leaguePage.payment.paymentOptions);
	const paymentProviders = useSelector(({ leaguePage }) => leaguePage.payment.paymentProviders);
	const user = useSelector(({ auth }) => auth.user);
	const paymentCollection = useSelector(({ leaguePage }) => leaguePage.payment.paymentCollection);

	// const { handleChange, setForm } = useForm({ ...defaultFormState });

	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = ['Select payement mode', 'Select your payment provider', 'Complete Payment'];

	const [selectedPaymentOptions, setSelectedPaymentOptions] = React.useState('');
	const [selectedPaymentProvider, setSelectedPaymentProvider] = React.useState('');
	const [accountNumber, setAccountNumber] = React.useState('');

	const handlePaymentModeSelection = event => {
		setSelectedPaymentOptions(event.target.value);
	};

	const handlePaymentProviderSelection = event => {
		setSelectedPaymentProvider(event.target.value);
	};

	const handleAccountNumberChange = event => {
		setAccountNumber(event.target.value);
	};

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleNextForPaymentOptions = () => {
		dispatch(Actions.getPaymentProviders(selectedPaymentOptions));
		handleNext();
	};

	const handleBackForPaymentProvider = () => {
		setSelectedPaymentProvider('');
		setAccountNumber('');
		dispatch(Actions.resetPaymentProviders());
		handleBack();
	};

	const handleNextForPaymentProvider = () => {
		// Make the payment collection API call

		const collectionRequestBody = {
			currency: 'USD',
			amount: 5,
			method: selectedPaymentOptions, // selected option
			provider_id: selectedPaymentProvider, // selected provider id
			account_number: accountNumber,
			narration: 'Payment for League', // Payment for League
			redirect_url: 'http://134.122.126.162:8080/web/dashboard', // Dashboard...later on history...
			account_name: user.data.displayName, // username
			account_email: user.data.email, // user email
			leagueId: paymentDialog.data._id
		};

		dispatch(Actions.makeCollectionRequest(collectionRequestBody));
	};

	useEffect(() => {
		if (
			paymentCollection.loading === false &&
			paymentCollection.data &&
			paymentCollection.data.payment_url !== ''
		) {
			window.open(paymentCollection.data.payment_url, '_self');
		}
	}, [paymentCollection.loading, paymentCollection.data]);

	useEffect(() => {
		if (paymentCollection.loading === false && paymentCollection.success) {
			handleNext();
		}
	}, [paymentCollection, paymentCollection.success, paymentCollection.loading]);

	const handleReset = () => {
		setActiveStep(0);
		setSelectedPaymentOptions('');
		setSelectedPaymentProvider('');
		setAccountNumber('');
		dispatch(Actions.resetPaymentProviders());
	};

	const validationForNextStepOfPaymentProvider = () => {
		if (selectedPaymentProvider === '') {
			return true;
		}

		if (accountNumber === '' && selectedPaymentOptions === 'MOBILE_MONEY') {
			return true;
		}

		return false;
	};

	const getStepContent = step => {
		switch (step) {
			case 0:
				return paymentOptions.length === 0 ? (
					<FuseLoading />
				) : (
					<div>
						<FormControl component="fieldset">
							{/* <FormLabel component="legend">Payment Mode</FormLabel> */}
							<RadioGroup
								aria-label="payment-mode"
								name="paymentMode"
								value={selectedPaymentOptions}
								onChange={handlePaymentModeSelection}
							>
								{paymentOptions.map(mode => (
									<FormControlLabel key={mode} value={mode} control={<Radio />} label={mode} />
								))}
							</RadioGroup>
						</FormControl>
						<div className={classes.actionsContainer}>
							<div>
								<Button
									variant="contained"
									color="primary"
									onClick={handleNextForPaymentOptions}
									className={classes.button}
								>
									Next
								</Button>
							</div>
						</div>
					</div>
				);
			case 1:
				return paymentProviders ? (
					<div>
						{paymentProviders.length > 0 ? (
							<FormControl component="fieldset">
								<RadioGroup
									aria-label="payment-mode"
									name="paymentProvider"
									value={selectedPaymentProvider}
									onChange={handlePaymentProviderSelection}
								>
									{paymentProviders.map(provider => (
										<FormControlLabel
											key={provider.id}
											value={provider.id}
											control={<Radio />}
											label={provider.name}
										/>
									))}
								</RadioGroup>
								{selectedPaymentOptions === 'MOBILE_MONEY' ? (
									<TextField
										id="account-number"
										label="Please provide your account number"
										helperText="Account number is your mobile no with Country Code. Ex 256777111000"
										value={accountNumber}
										onChange={handleAccountNumberChange}
										required={true}
										type="number"
									/>
								) : (
									<></>
								)}
							</FormControl>
						) : (
							<Typography>
								Sorry No Payment Providers available for the selected option! Please try another option.
							</Typography>
						)}
						<div className={classes.actionsContainer}>
							<div>
								<Button onClick={handleBackForPaymentProvider} className={classes.button}>
									Back
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={handleNextForPaymentProvider}
									className={classes.button}
									disabled={validationForNextStepOfPaymentProvider()}
								>
									Next
								</Button>
							</div>
						</div>
					</div>
				) : (
					<FuseLoading />
				);
			case 2:
				return paymentCollection.loading ? (
					<FuseLoading />
				) : (
					paymentCollection.data && (
						<div>
							<div className="py-12">
								<div className="flex items-center">
									<Icon color="action">attach_money</Icon>
									<Typography className="h2 mx-16" color="textSecondary">
										Please continue your payment on your selected payment provider.
									</Typography>
								</div>

								<div className="table-responsive">
									<table className="simple">
										<thead>
											<tr>
												<th>TransactionID</th>
												<th>Amount</th>
												<th>Status</th>
												<th>Message</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<span className="truncate">
														{paymentCollection.data.internal_reference}
													</span>
												</td>
												<td>
													<span className="truncate">
														{paymentCollection.data.account_currency + ' '}
														{paymentCollection.data.account_amount}
													</span>
												</td>
												<td>
													<span className="truncate">
														{paymentCollection.data.transaction_status}
													</span>
												</td>
												<td>
													<span className="truncate">{paymentCollection.data.message}</span>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)
				);
			default:
				return 'Unknown step';
		}
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'new'
		 */
		if (paymentDialog.type === 'new') {
			handleReset();
			dispatch(Actions.getPaymentOptions());
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

	return (
		<Dialog
			{...paymentDialog.props}
			onClose={closePaymentDialog}
			fullWidth
			maxWidth="lg"
			classes={{ paper: classes.dialogPaper }}
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Payment Process
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				<div className="px-16 sm:px-24">
					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
								<StepContent>{getStepContent(index)}</StepContent>
							</Step>
						))}
					</Stepper>
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
