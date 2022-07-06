import { TextFieldFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as authActions from 'app/auth/store/actions';
import Formsy from 'formsy-react';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

function ForgotForm(props) {
	const dispatch = useDispatch();
	// const forgotPassword = useSelector(({ auth }) => auth.forgotPassword);

	const [isFormValid, setIsFormValid] = useState(false);

	const formRef = useRef(null);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		Promise.all([dispatch(authActions.forgotPassword(model))]).finally(() => {
			formRef.current.reset();
		});
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
					type="email"
					name="email"
					label="Email Address"
					// value="admin"
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
									email
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
					className="w-full mx-auto mt-16 normal-case blue-ios-button"
					aria-label="LOG IN"
					disabled={!isFormValid}
					value="legacy"
				>
					Get Reset Link
				</Button>
			</Formsy>

			<div className="flex flex-col items-center pt-24">
				<Divider className="mb-16 w-256" />
			</div>
		</div>
	);
}

export default ForgotForm;
