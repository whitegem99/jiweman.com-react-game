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
import { find } from 'lodash';
import countriesList from '../league/countries';

const defaultFormState = {
	gameName: '',
	gameInfo: '',
	status: 'active',
	numberOfGoalsToWin: 1,
	entryFee: 0,
	currencyConversionRisk: 0,
	allowedCountries: [],
	jiwemanCommisionPercentage: 0,
	gameRegionType: '',
	gameCurrency: '',
	stakeAmount: 0,
	type_of_business: 0,
	salesTax:0,
	winningTax:0,
	taxOnStakeOfBet:0,
	bettingCompanyCommisionPercentage:0
};

const countries = countriesList;

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function LeagueDialog(props) {
	const dispatch = useDispatch();
	const leagueDialog = useSelector(({ oneOnOnePage }) => oneOnOnePage.game.leagueDialog);
	const [uploading, setUploading] = useState(false);
	const { form, handleChange, setForm } = useForm({ ...defaultFormState });

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

	const handleChangeNumber = event => {
		let object = event.target;
		const newObj = {};
		newObj.value = parseFloat(object.value);
		newObj.max = parseInt(object.max, 10);
		newObj.min = parseInt(object.min, 10);

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
			setForm({
				...defaultFormState,
				...leagueDialog.data
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
			? dispatch(Actions.closeEditGameDialog())
			: dispatch(Actions.closeNewGameDialog());
	}

	const handleAddEditLeague = event => {
		event.preventDefault();

		if (!event.currentTarget.checkValidity()) {
			return event.currentTarget.reportValidity();
		}

		const req = {
			...form,
			gameCount: parseInt(form.gameCount || 0, 10),
			entryFee: parseFloat(form.entryFee || 0)
		};

		if(req.gameRegionType === 'local'){
			req.currencyConversionRisk = 0;
		}

		// console.log('On Error this should not execute');
		leagueDialog.type === 'edit' ? dispatch(Actions.editGame(req)) : dispatch(Actions.addGame(req));

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
			cardImage: uploadResponse.url
		});
		setUploading(false);
	};

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
						{leagueDialog.type === 'new' ? 'New One On One' : 'Edit One On One'}
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
									label="Game Name"
									autoFocus
									name="gameName"
									value={form.gameName}
									onChange={handleChange}
									required
									variant="outlined"
								/>
							</FormControl>
						</div>
						{/* <div className="flex py-12">
							<FormControl className="px-8" required fullWidth>
								<TextField
									label="Game Info"
									name="gameInfo"
									value={form.gameInfo}
									onChange={handleChange}
									required
									variant="outlined"
								/>
							</FormControl>
						</div> */}

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
						</div>

						<div className="flex py-12">
							<FormControl className="px-8" variant="outlined" required fullWidth>
								<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
									Game Region Type
								</InputLabel>
								<Select
									value={form.gameRegionType}
									labelId="demo-simple-select-outlined-label-region"
									id="demo-simple-select-outlined-region"
									onChange={handleChange}
									required
									label="Game Region Type"
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
							<FormControl
								className="px-8"
								required
								fullWidth
							// style={{ display: form.prizeDistributionType === 'fixed' ? 'none' : 'flex' }}
							>
								<TextField
									label="Jiweman Commision Percentage"
									name="jiwemanCommisionPercentage"
									type="number"
									value={form.jiwemanCommisionPercentage}
									inputProps={{
										min: 0
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
								<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-country">
									Game Status
								</InputLabel>
								<Select
									value={form.status}
									labelId="demo-simple-select-outlined-label-country"
									id="demo-simple-select-outlined-country"
									onChange={handleChange}
									required
									label="Game Status"
									name="status"
								>
									{[
										{ name: 'Active', value: 'active' },
										{ name: 'Ended', value: 'ended' }
									].map(({ name, value }) => (
										<MenuItem value={value}>{name}</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>

						<div className="flex py-12">
							<FormControl className="px-8" variant="outlined" required fullWidth>
								<InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-country">
									Business Type
								</InputLabel>
								<Select
									value={form.type_of_business}
									labelId="demo-simple-select-outlined-label-country"
									id="demo-simple-select-outlined-country"
									onChange={handleChange}
									required
									label="Business Type"
									name="type_of_business"
								>
									{[
										{ name: 'Customer First', value: 'customer_first' },
										{ name: 'Business First', value: 'business_first' }
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
									label="Game Count"
									name="gameCount"
									type="number"
									value={form.gameCount}
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
						<div className="flex py-12">
							<FormControl
								className="px-8"
								required
								fullWidth
							>
								<TextField
									label="Betting Company Commision Percentage"
									name="bettingCompanyCommisionPercentage"
									type="number"
									value={form.bettingCompanyCommisionPercentage}
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
								: form.cardImage === ''
									? 'No Image Uploaded'
									: form.cardImage}
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
