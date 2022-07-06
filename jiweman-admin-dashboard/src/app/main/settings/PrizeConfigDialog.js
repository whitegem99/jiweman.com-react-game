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
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
const defaultFormState = {
	position: 1,
	allocation: []
};

function PrizeConfigDialog(props) {
	const dispatch = useDispatch();
	const prizeConfigDialog = useSelector(({ settingsPage }) => settingsPage.settings.prizeConfigDialog);

	const { form, setForm } = useForm({ ...defaultFormState });

	const handleChangeOfPrize = (event, i) => {
		let newPrize = [...form.allocation];

		const object = event.target;
		const newObj = {};
		newObj.value = parseInt(object.value, 10);
		newObj.max = parseInt(object.max, 10);
		newObj.min = parseInt(object.min, 10);
		newObj.maxLength = parseInt(object.maxLength, 10);

		console.log(object.value, object.max, object.min, object.maxLength);
		if (object.value.length > object.maxLength) {
			object.value = object.value.slice(0, object.maxLength);
		}

		if (object.value > object.max) {
			object.value = object.value.slice(0, -1);
		}

		if (newObj.value === 'NaN') {
			newObj.value = 0;
		}

		newPrize[i] = newObj.value;

		setForm({
			...form,
			allocation: newPrize
		});
	};

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

		if (_.isNaN(newObj.value)) {
			newObj.value = 0;
		}

		setForm({
			...form,
			position: parseInt(newObj.value > -1 ? newObj.value : 0, 10),
			allocation: Array(parseInt(newObj.value > -1 ? newObj.value : 0, 10)).fill(0)
		});
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (prizeConfigDialog.type === 'edit' && prizeConfigDialog.data) {
			setForm({
				...defaultFormState,
				...prizeConfigDialog.data
			});
		}

		/**
		 * Dialog type: 'new'
		 */
		if (prizeConfigDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...prizeConfigDialog.data
			});
		}
	}, [prizeConfigDialog.data, prizeConfigDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (prizeConfigDialog.props.open) {
			initDialog();
		}
	}, [prizeConfigDialog.props.open, initDialog]);

	function closePrizeConfigDialog() {
		return prizeConfigDialog.type === 'edit'
			? dispatch(Actions.closeEditPrizeConfigDialog())
			: dispatch(Actions.closeNewPrizeConfigDialog());
	}

	const handleAddEditPrizeConfig = event => {
		event.preventDefault();

		if (!event.currentTarget.checkValidity()) {
			return event.currentTarget.reportValidity();
		}

		const req = {
			...form
		};

		// console.log('On Error this should not execute');
		prizeConfigDialog.type === 'edit'
			? dispatch(Actions.editPrizeConfig(req))
			: dispatch(Actions.addPrizeConfig(req));

		closePrizeConfigDialog();
	};

	return (
		<Dialog
			{...prizeConfigDialog.props}
			onClose={closePrizeConfigDialog}
			fullWidth
			maxWidth="md"
			disableBackdropClick={true}
			// disableEscapeKeyDown="true"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{prizeConfigDialog.type === 'new' ? 'New PrizeConfig' : 'Edit PrizeConfig'}
					</Typography>
					<IconButton aria-label="close" color="inherit" onClick={closePrizeConfigDialog}>
						<CloseIcon color="inherit" />
					</IconButton>
				</Toolbar>
			</AppBar>

			<form
				onSubmit={event => {
					handleAddEditPrizeConfig(event);
				}}
			>
				<DialogContent classes={{ root: 'p-0' }}>
					<div className="px-16 pt-16 sm:px-24">
						<div className="flex py-8">
							<FormControl className="px-4" required fullWidth>
								<TextField
									label="Prize Count"
									name="position"
									type="number"
									value={form.position}
									inputProps={{
										min: 1,
										max: 20
									}}
									onChange={event => {
										handleNumberOfPrizeChange(event);
									}}
									variant="outlined"
									required
								/>
							</FormControl>
						</div>
						<div className="flex flex-wrap py-8">
							{[...Array.apply(0, { length: form.position })].map((e, i) => (
								<FormControl key={i} className="px-4 py-8 sm:w-1/3" required fullWidth>
									<TextField
										label={'Prize ' + (i + 1)}
										name={'prize' + (i + 1)}
										type="number"
										value={form.allocation[i]}
										onChange={event => {
											handleChangeOfPrize(event, i);
										}}
										variant="outlined"
										inputProps={{
											min: 0,
											max: 10000,
											maxLength: 5
										}}
										required
									/>
								</FormControl>
							))}
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
							{prizeConfigDialog.type === 'new' ? 'Add' : 'Save'}
						</Button>
						<Typography className=" text-18 font-400">*All Fields are Mandatory</Typography>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default PrizeConfigDialog;
