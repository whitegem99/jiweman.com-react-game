import { CheckboxFormsy, SelectFormsy, TextFieldFormsy } from '@fuse/core/formsy';
import history from '@history';
import { MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as authActions from 'app/auth/store/actions';
import Formsy from 'formsy-react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import countries from './Countries.js';
import PhoneNumberFormsy from '@fuse/core/formsy/PhoneNumberFormsy.js';
import withReducer from 'app/store/withReducer';
import reducer from 'app/auth/store/reducers';
import axios from 'axios';

function JWTRegisterTab(props) {
	const dispatch = useDispatch();
	const register = useSelector(({ auth }) => auth.register);
	// const companies = useSelector(({ auth }) => auth.companies);
	const [companies, setCompanies] = useState(false);

	const [isFormValid, setIsFormValid] = useState(false);
	const formRef = useRef(null);

	useEffect(() => {
		if (register.error && (register.error.username || register.error.password || register.error.email)) {
			formRef.current.updateInputsWithError({
				...register.error
			});
			disableButton();
		}
	}, [register.error]);

	useEffect(() => {
		getCompanies();
	}, [dispatch]);

	function getCompanies() {
		axios
			.get('/bettingCompany/allByCountry/')
			.then(response => {
				setCompanies(response.data.data);
			})
			.catch(error => console.log(error));
	}

	// useEffect(() => {
	// 	if (register.success) {
	// 		history.push({
	// 			pathname: '/login'
	// 		});
	// 	}
	// }, [register.success]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		console.log(model);
		const userObj = {
			...model,
			fullName: model.firstName + ' ' + (model.middleName ? model.middleName + ' ' : '') + model.lastName,
			userName: model.userName.trim(),
			dateOfBirth: moment(model.dateOfBirth).format('DD-MM-YYYY')
		};
		dispatch(authActions.submitRegister(userObj));
	}

	return (
		<div className="w-full">
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				className="flex flex-col justify-center w-full"
			>
				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="firstName"
					label="First name"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Min character length is 4'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									person
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="middleName"
					label="Middle name"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Min character length is 4'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									person
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
				/>
				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="lastName"
					label="Last name"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Min character length is 4'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									person
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="userName"
					label="Username"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									person
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="email"
					label="Email"
					validations="isEmail"
					validationErrors={{
						isEmail: 'Please enter a valid email'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									email
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>
				<TextFieldFormsy
					className="mb-16"
					type="date"
					name="dateOfBirth"
					label="Date Of Birth"
					// validations="isEail"
					// validationErrors={{
					// 	isEmail: 'Please enter a valid email'
					// }}
					InputLabelProps={{
						shrink: true
					}}
					variant="outlined"
					required
				/>

				<SelectFormsy className="mb-16" name="gender" label="Gender" variant="outlined" required>
					<MenuItem value="male">Male</MenuItem>
					<MenuItem value="female">Female</MenuItem>
				</SelectFormsy>

				<SelectFormsy className="mb-16" name="countryOfRecidence" label="Country" variant="outlined" required>
					{countries.map(({ name }) => {
						return (
							<MenuItem key={name} value={name}>
								{name}
							</MenuItem>
						);
					})}
				</SelectFormsy>

				{/* <SelectFormsy
					className="mb-16"
					name="bettingCompanyId"
					label="Betting Company"
					variant="outlined"
					required
				>
					{companies &&
						companies.map(obj => {
							return (
								<MenuItem key={obj._id} value={obj._id}>
									{obj.name}
								</MenuItem>
							);
						})}
				</SelectFormsy> */}
				<PhoneNumberFormsy
					className="mb-16"
					name="mobile"
					label="Mobile No with country code"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									person
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="password"
					name="password"
					label="Password"
					validations="equalsField:confirmPassword"
					validationErrors={{
						equalsField: 'Passwords do not match'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="password"
					name="confirmPassword"
					label="Confirm Password"
					validations="equalsField:password"
					validationErrors={{
						equalsField: 'Passwords do not match'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="text"
					name="referCode"
					label="Referal Code"
					variant="outlined"
				/>

				<CheckboxFormsy
					className="mb-16"
					name="accept"
					value={false}
					label={
						<a href="./terms-n-conditions" target="_blank">
							I agree to the TnC's
						</a>
					}
					n
					validations={{
						equals: true
					}}
					// validationErrors={{
					// 	equals: 'Please accept the TnC to continue'
					// }}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16 normal-case blue-ios-button"
					aria-label="REGISTER"
					disabled={!isFormValid}
					value="legacy"
				>
					Register
				</Button>
			</Formsy>
		</div>
	);
}

export default withReducer('auth', reducer)(JWTRegisterTab);
