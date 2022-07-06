import { TextFieldFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as authActions from 'app/auth/store/actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import Formsy from 'formsy-react';
import qs from 'qs';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

function JWTLoginTab(props) {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const location = useLocation();
	const { status, message } = qs.parse(location.search, { ignoreQueryPrefix: true });

	useEffect(() => {
		if ((status, message)) {
			dispatch(
				MessageActions.showMessage({
					message: message, //text or html
					autoHideDuration: 6000, //ms
					anchorOrigin: {
						vertical: 'top', //top bottom
						horizontal: 'right' //left center right
					},
					variant: status ? 'success' : 'error' //success error info warning null
				})
			);
		}
	}, [dispatch, status, message]);

	const [isFormValid, setIsFormValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const formRef = useRef(null);

	useEffect(() => {
		if (login.error && (login.error.email || login.error.password)) {
			formRef.current.updateInputsWithError({
				...login.error
			});
			disableButton();
		}
	}, [login.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		let req = {
			...model,
			email: model.email.trim()
		};
		dispatch(authActions.submitLogin(req));
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
					name="email"
					label="Username"
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
					type="password"
					name="password"
					label="Password"
					// value="admin"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Min character length is 4'
					}}
					InputProps={{
						className: 'pr-2',
						type: showPassword ? 'text' : 'password',
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={() => setShowPassword(!showPassword)}>
									<Icon className="text-20" color="action">
										{showPassword ? 'visibility' : 'visibility_off'}
									</Icon>
								</IconButton>
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
					className="w-full mx-auto mt-16 normal-case blue-ios-button"
					aria-label="LOG IN"
					disabled={!isFormValid}
					value="legacy"
				>
					Login
				</Button>
			</Formsy>

			<div className="flex flex-col items-center pt-24">
				<Divider className="mb-16 w-256" />
			</div>
		</div>
	);
}

export default JWTLoginTab;
