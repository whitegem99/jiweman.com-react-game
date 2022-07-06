import { TextFieldFormsy } from '@fuse/core/formsy';
import history from '@history';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as authActions from 'app/auth/store/actions';
import Formsy from 'formsy-react';
import qs from 'qs';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

function ResetForm(props) {
	const dispatch = useDispatch();
	const reset = useSelector(({ auth }) => auth.reset);
	const location = useLocation();
	const { email = '', token } = qs.parse(location.search, { ignoreQueryPrefix: true });
	const [isFormValid, setIsFormValid] = useState(false);
	// const [emailFromUrl, setEmailFromUrl] = useState('');
	const formRef = useRef(null);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit({ password }) {
		Promise.all([
			dispatch(
				authActions.resetPassword({
					//...queryParams
					// ...model
					email,
					token,
					password,
					password_conformation: password
				})
			)
		]).finally(() => {});
	}

	useEffect(() => {
		console.log(reset);
		if (reset.success) {
			history.push({
				pathname: '/login'
			});
		}
	}, [reset]);

	return (
		<div className="w-full">
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				className="flex flex-col justify-center w-full"
			>
				<TextField
					className="mb-16"
					type="email"
					name="email"
					label="Email Address"
					value={email}
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
					disabled={true}
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

				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16 normal-case"
					aria-label="LOG IN"
					disabled={!isFormValid}
					value="legacy"
				>
					Reset Password
				</Button>
			</Formsy>

			<div className="flex flex-col items-center pt-24">
				<Divider className="mb-16 w-256" />
			</div>
		</div>
	);
}

export default ResetForm;
