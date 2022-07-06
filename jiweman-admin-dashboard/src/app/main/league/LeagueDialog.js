import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { IconButton, InputLabel, MenuItem, Select, Slide } from '@material-ui/core';
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
import Axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import countriesList from './countries'
import { find } from 'lodash';
const defaultFormState = {
	leagueName: '',
	brandId: '',
	leagueMessage: '',
	leagueType: '',
	startDate: '',
	endDate: '',
	// startTime: '',
	// endTime: '',
	numberOfPrizes: 0,
	// prizeDistributionPercentages: [],
	gameCount: 1,
	numberOfGoalsToWin: 1,
	leagueCardImageUrl: '',
	entryFee: 0,
	startSaleDate: '',
	endSaleDate: '',
	currencyConversionRisk: 0,
	prizeDistributionType: 'fixed',
	jiwemanCommisionPercentage: 0,
	prizePoolPercentage: 0,
	allowedCountries: [],
	sponsorPrizeAmount: 0,
	gameRegionType: '',
	gameCurrency: '',
	stakeAmount: 0,
	bettingCompanyCommisionPercentage: 0,
	type_of_business: '',
	salesTax:0,
	winningTax:0,
	taxOnStakeOfBet:0
};

const countries = countriesList;

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function LeagueDialog(props) {
	const dispatch = useDispatch();
	const leagueDialog = useSelector(({ leaguePage }) => leaguePage.league.leagueDialog);
	const prizeConfigData = useSelector(({ leaguePage }) => leaguePage.settings.prizeConfigData);
	const [uploading, setUploading] = useState(false);
	const { form, handleChange, setForm } = useForm({ ...defaultFormState });

	// const handleChangeOfPrize = (event, i) => {
	// 	let newPrize = [...form.prizeDistributionPercentages];

	// 	const object = event.target;
	// 	const newObj = {};
	// 	newObj.value = parseInt(object.value, 10);
	// 	newObj.max = parseInt(object.max, 10);
	// 	newObj.min = parseInt(object.min, 10);
	// 	newObj.maxLength = parseInt(object.maxLength, 10);

	// 	console.log(object.max, object.min, object.maxLength);
	// 	if (object.value.length > object.maxLength) {
	// 		object.value = object.value.slice(0, object.maxLength);
	// 	}

	// 	if (object.value > object.max) {
	// 		object.value = object.value.slice(0, -1);
	// 	}

	// 	if (newObj.value === 'NaN') {
	// 		newObj.value = 0;
	// 	}

	// 	newPrize[i] = newObj.value;

	// 	setForm({
	// 		...form,
	// 		prizeDistributionPercentages: newPrize
	// 	});
	// };

	const handleChangeCountries = (event, index, value) => {
		console.log(event, index, value)
		let allowedCountries;
		let gameCurrency;
		if (form.gameRegionType === 'local') {
			allowedCountries = [event.target.value[event.target.value.length - 1]];
			const found = find(countries, (ob) => {
				return ob.name === allowedCountries[0];
			});
			if (found) {
				gameCurrency = found.currency
			}

		} else if (form.gameRegionType === 'international') {
			allowedCountries = event.target.value
			gameCurrency = 'USD'
		}

		const updatedForm = {
			...form,
			allowedCountries,
			gameCurrency
		}
		setForm(updatedForm)
	}

	const handleNumberOfPrizeChange = event => {
		let object = event.target;
		const newObj = {};
		newObj.value = parseInt(object.value, 10);
		newObj.max = parseInt(object.max, 10);
		newObj.min = parseInt(object.min, 10);
		newObj.maxLength = parseInt(object.maxLength, 10);

		if (newObj.value.length > newObj.maxLength) {
			newObj.value = newObj.value.slice(0, newObj.maxLength);
		}

		if (newObj.value > newObj.max) {
			newObj.value = parseInt(newObj.value / 10, 10);
		}

		setForm({
			...form,
			numberOfPrizes: parseInt(newObj.value || 0, 10)
			// prizeDistributionPercentages: Array(parseInt(newObj.value || 0, 10)).fill(0)
		});
	};
	
	const handleMinimumReward = event => {
		let object = event.target;
		const newObj = {};
		newObj.value = parseInt(object.value, 10);
		newObj.max = parseInt(object.max, 10);
		newObj.min = parseInt(object.min, 10);
		newObj.maxLength = parseInt(object.maxLength, 10);

		if (newObj.value.length > newObj.maxLength) {
			newObj.value = newObj.value.slice(0, newObj.maxLength);
		}

		if (newObj.value > newObj.max) {
			newObj.value = parseInt(newObj.value / 10, 10);
		}

		setForm({
			...form,
			minimumReward: parseInt(newObj.value || 0, 10)
		});
	};
	
	const handlePrizePercentage = event => {
		let object = event.target;
		const newObj = {};
		newObj.value = parseInt(object.value, 10);
		newObj.max = parseInt(object.max, 10);
		newObj.min = parseInt(object.min, 10);
		newObj.maxLength = parseInt(object.maxLength, 10);

		if (newObj.value.length > newObj.maxLength) {
			newObj.value = newObj.value.slice(0, newObj.maxLength);
		}

		if (newObj.value > newObj.max) {
			newObj.value = parseInt(newObj.value / 10, 10);
		}

		setForm({
			...form,
			prizePercentage: parseInt(newObj.value || 0, 10)
		});
	};

	const handleChangeNumber = event => {
		let object = event.target;
		const newObj = {};
		newObj.value = parseFloat(object.value);
		newObj.max = parseInt(object.max, 10);
		newObj.min = parseInt(object.min, 10);

		console.log(newObj);
		// newObj.maxLength = parseInt(object.maxLength, 10);

		// if (newObj.value.length > newObj.maxLength) {
		// 	newObj.value = newObj.value.slice(0, newObj.maxLength);
		// }

		if (newObj.value > newObj.max) {
			newObj.value = parseFloat(newObj.value / 10);
		}

		setForm({
			...form,
			[object.name]: newObj.value >= 0 ? newObj.value : ''
		});
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (leagueDialog.type === 'edit' && leagueDialog.data) {
			const startDate = moment(leagueDialog.data.startDate).utc().format('YYYY-MM-DDThh:mm');
			const endDate = moment(leagueDialog.data.endDate).utc().format('YYYY-MM-DDThh:mm');
			// const startTime = moment(leagueDialog.data.startTime).format('hh:mm');
			// const endTime = moment(leagueDialog.data.endTime).format('hh:mm');
			const startSaleDate = moment(leagueDialog.data.startSaleDate).utc().format('YYYY-MM-DDThh:mm');
			const endSaleDate = moment(leagueDialog.data.endSaleDate).utc().format('YYYY-MM-DDThh:mm');

			setForm({
				...defaultFormState,
				...leagueDialog.data,
				startDate,
				endDate,
				// startTime,
				// endTime,
				startSaleDate,
				endSaleDate
			});
		}

		/**
		 * Dialog type: 'new'
		 */
		if (leagueDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...leagueDialog.data
			});
		}
	}, [leagueDialog.data, leagueDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (leagueDialog.props.open) {
			initDialog();
		}
	}, [leagueDialog.props.open, initDialog]);

	function closeLeagueDialog() {
		return leagueDialog.type === 'edit'
			? dispatch(Actions.closeEditLeagueDialog())
			: dispatch(Actions.closeNewLeagueDialog());
	}

	// function canBeSubmitted() {
	// 	return true;
	// }

	const handleAddEditLeague = event => {
		console.log(form)
		event.preventDefault();

		if (!event.currentTarget.checkValidity()) {
			return event.currentTarget.reportValidity();
		}

		const req = {
			...form,
			gameCount: parseInt(form.gameCount || 0, 10),
			entryFee: parseFloat(form.entryFee || 0)
			// startDate: moment(form.startDate).format('DD-MM-YYYY'),
			// endDate: moment(form.endDate).format('DD-MM-YYYY')
		};

		if(req.gameRegionType === 'local'){
			req.currencyConversionRisk = 0;
		}

		// console.log('On Error this should not execute');
		leagueDialog.type === 'edit' ? dispatch(Actions.editLeague(req)) : dispatch(Actions.addLeague(req));

		console.log(form)
		closeLeagueDialog();
	};

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
		let { data: uploadResponse } = await Axios.post('/uploadFile', files);

		setForm({
			...form,
			leagueCardImageUrl: uploadResponse.url
		});
		setUploading(false);
	};

	// const setDefaultPrizeDistribution = nop => {
	// 	let positionConfig = _.find(prizeConfigData, function (o) {
	// 		return o.position == nop;
	// 	});

	// 	if (!positionConfig) {
	// 		positionConfig = {
	// 			allocation: []
	// 		};
	// 	}

	// 	let newPrize = [...form.prizeDistributionPercentages];
	// 	positionConfig.allocation.forEach((ob, index) => {
	// 		newPrize[index] = ob;
	// 	});

	// 	setForm({
	// 		...form,
	// 		prizeDistributionPercentages: newPrize
	// 	});
	// };

	return (
		<Dialog
			{...leagueDialog.props}
			onClose={closeLeagueDialog}
			fullScreen
			disableBackdropClick={true}
			TransitionComponent={Transition}
		// disableEscapeKeyDown="true"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{leagueDialog.type === 'new' ? 'New League' : 'Edit League'}
					</Typography>
					<IconButton aria-label="close" color="inherit" onClick={closeLeagueDialog}>
						<CloseIcon color="inherit" />
					</IconButton>
				</Toolbar>
			</AppBar>

			<form
				onSubmit={event => {
					handleAddEditLeague(event);
				}}
			>
				<DialogContent classes={{ root: 'p-0 pt-0' }}>
					<div className="sm:px-24">
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="League Name"
									autoFocus
									name="leagueName"
									value={form.leagueName}
									onChange={handleChange}
									required
									variant="outlined"
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="League Message"
									name="leagueMessage"
									value={form.leagueMessage}
									onChange={handleChange}
									required
									variant="outlined"
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="Brand Name"
									name="brandId"
									value={form.brandId}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="League Type"
									name="leagueType"
									value={form.leagueType}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="Goals to win"
									name="numberOfGoalsToWin"
									type="number"
									value={form.numberOfGoalsToWin}
									onChange={handleChangeNumber}
									variant="outlined"
									required
									inputProps={{
										min: 1,
										max: 100,
										maxLength: 3
									}}
								/>
							</FormControl>
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="Game Count"
									name="gameCount"
									type="number"
									value={form.gameCount}
									onChange={handleChangeNumber}
									variant="outlined"
									required
									inputProps={{
										min: 1,
										max: 100,
										maxLength: 3
									}}
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									name="startSaleDate"
									label="Sale Start Date Time"
									type="datetime-local"
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										max: form.endSaleDate
									}}
									value={form.startSaleDate}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl className="px-8" required fullWidth>
								<TextField
									name="endSaleDate"
									label="Sale End Date Time"
									type="datetime-local"
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										min: form.startSaleDate
									}}
									value={form.endSaleDate}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									name="startDate"
									label="Start Date"
									type="datetime-local"
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										max: form.endDate,
										min: form.startSaleDate
									}}
									value={form.startDate}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl className="px-8" required fullWidth>
								<TextField
									name="endDate"
									label="End Date"
									type="datetime-local"
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										min: form.startDate
									}}
									value={form.endDate}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>

						<div className="flex py-12">
							<FormControl className="px-8" variant="outlined" required fullWidth>
								<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
									League Region Type
								</InputLabel>
								<Select
									value={form.gameRegionType}
									labelId="demo-simple-select-outlined-label-region"
									id="demo-simple-select-outlined-region"
									onChange={handleChange}
									required
									label="League Region Type"
									name="gameRegionType"
								>
									{[
										{ name: 'Local', value: 'local' },
										{ name: 'International', value: 'international' }

									].map(({ name, value }) => (
										<MenuItem value={value}>{name}</MenuItem>
									))}
								</Select>
								{/* <FormHelperText>Without label</FormHelperText> */}
							</FormControl>
							<FormControl className="px-8" variant="outlined" required fullWidth>
								<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-country">
									Eligible Countries
								</InputLabel>
								<Select
									value={form.allowedCountries}
									labelId="demo-simple-select-outlined-label-country"
									id="demo-simple-select-outlined-country"
									onChange={handleChangeCountries}
									required
									multiple
									label="Eligible Countries"
									name="allowedCountries"
								>
									{countries.map(({ name }) => (
										<MenuItem value={name}>{name}</MenuItem>
									))}
								</Select>
								{/* <FormHelperText>Without label</FormHelperText> */}
							</FormControl>
						</div>

						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="Entry Fee"
									name="entryFee"
									type="number"
									value={form.entryFee}
									inputProps={{
										min: 0,
										max: 999999,
										//maxLength: 5
										step: '0.01'
									}}
									onChange={handleChangeNumber}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="Jiweman Entry Fee Commission Percentage"
									name="jiwemanCommisionPercentage"
									type="number"
									value={form.jiwemanCommisionPercentage}
									inputProps={{
										min: 0,
										max: 100
									}}
									onChange={event => {
										handleChangeNumber(event);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
							{form.gameRegionType === 'international' && <FormControl className="px-8" required fullWidth>
								<TextField
									label="Currency Coversion Risk Percentage"
									name="currencyConversionRisk"
									type="number"
									value={form.currencyConversionRisk}
									inputProps={{
										min: 0,
										max: 100
									}}
									onChange={event => {
										handleChangeNumber(event);
									}}
									variant="outlined"
									required
								/>
							</FormControl>}
						</div>
						<div className="flex py-12">
							<FormControl className="px-8" variant="outlined" required fullWidth>
								<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label">
									Prize Distribution Type
								</InputLabel>
								<Select
									value={form.prizeDistributionType}
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									onChange={handleChange}
									required
									label="Prize Distribution Type"
									name="prizeDistributionType"
								>
									<MenuItem value={'fixed'}>Fixed</MenuItem>
									<MenuItem value={'variable'}>Variable</MenuItem>
									<MenuItem value={'hybrid'}>Hybrid</MenuItem>
								</Select>
								{/* <FormHelperText>Without label</FormHelperText> */}
							</FormControl>
							{form.prizeDistributionType !== 'variable' && (
								<>
									<FormControl className="px-8" required fullWidth>
										<TextField
											label="Prize Count"
											name="numberOfPrizes"
											type="number"
											value={form.numberOfPrizes}
											inputProps={{
												min: 1,
												max: 10000
											}}
											onChange={event => {
												handleNumberOfPrizeChange(event);
											}}
											variant="outlined"
											required
										/>
									</FormControl>
								</>
							)}
						</div>
						<div className="flex py-12">
							<FormControl
								className="px-8"
								required
								fullWidth
								style={{ display: form.prizeDistributionType === 'variable' ? 'none' : 'flex' }}
							>
								<TextField
									label="Sponsor Prize Amount"
									name="sponsorPrizeAmount"
									type="number"
									value={form.sponsorPrizeAmount}
									inputProps={{
										min: 0,
										max: 100000
									}}
									onChange={event => {
										handleChangeNumber(event);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl
								className="px-8"
								required
								fullWidth
								style={{ display: form.prizeDistributionType === 'fixed' ? 'none' : 'flex' }}
							>
								<TextField
									label="Prize Pool Percentage(of Entry Fee)"
									name="prizePoolPercentage"
									type="number"
									value={form.prizePoolPercentage}
									inputProps={{
										min: 0,
										max: 100
									}}
									onChange={event => {
										handleChangeNumber(event);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Minimum Prize Amount"
									name="minimumReward"
									type="number"
									value={form.minimumReward}
									inputProps={{
										min: 0,
										max: 100000
									}}
									onChange={event => {
										handleMinimumReward(event);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Prizes Percentage (of total participient. eg 0.04 or 0.2)"
									autoFocus
									name="prizePercentage"
									value={form.prizePercentage}
									onChange={handleChange}
									required
									variant="outlined"
								/>
							</FormControl>
						</div>
						<div className="flex py-12">
							{/* <FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Stake Amount"
									name="stakeAmount"
									type="number"
									value={form.stakeAmount}
									inputProps={{
										min: 0,
										max: 100000
									}}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl> */}
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Sales Tax"
									name="salesTax"
									type="number"
									value={form.salesTax}
									inputProps={{
										min: 0,
										max: 100000
									}}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
							
						</div>
						<div className="flex py-12">
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Betting Company Percentage (e.g 0.1 or 0.03)"
									name="bettingCompanyCommisionPercentage"
									type="number"
									value={form.bettingCompanyCommisionPercentage}
									// inputProps={{
									// 	min: 0,
									// 	max: 100000
									// }}
									onChange={handleChangeNumber}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl className="px-8" variant="outlined" required fullWidth>
                                    <InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
                                         Business Type
                                    </InputLabel>
                                    <Select
                                        value={form.type_of_business}
                                        labelId="demo-simple-select-outlined-label-region"
                                        id="demo-simple-select-outlined-region"
                                        onChange={handleChange}
                                        required
                                        label="Business Type"
                                        name="type_of_business"
                                    >
                                        {[
                                            { name: 'Customers', value: 'customer_first' },
                                            { name: 'Business', value: 'business_first' }
                                        ].map(({ name, value }) => (
                                            <MenuItem value={value}>{name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
						</div>
						<div className="flex py-12">
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Winning Tax"
									name="winningTax"
									type="number"
									value={form.winningTax}
									inputProps={{
										min: 0,
										max: 100000
									}}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Tax On Stake Of Bet"
									name="taxOnStakeOfBet"
									type="number"
									value={form.taxOnStakeOfBet}
									inputProps={{
										min: 0,
										max: 100000
									}}
									onChange={handleChange}
									variant="outlined"
									required
								/>
							</FormControl>
							
						</div>
						<div className="pb-8 px-8">
							<input type="file" onChange={handleFileChange} multiple={false} />
						</div>
						<div className="px-8">
							{uploading
								? 'Uploading file... Please wait...!!'
								: form.leagueCardImageUrl === ''
									? 'No Image Uploaded'
									: form.leagueCardImageUrl}
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
							// 	handleAddEditLeague();
							// }}
							// disabled={!canBeSubmitted()}
							type="submit"
						>
							{leagueDialog.type === 'new' ? 'Add' : 'Save'}
						</Button>
						<Typography className=" text-18 font-400">*All Fields are Mandatory</Typography>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default LeagueDialog;
