import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

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


function FeedbackDialog(props) {
	
	const classes = useStyles();
	const dispatch = useDispatch();
	const feedbackDialog = useSelector(({ feedbacks }) => feedbacks.feedbacks.feedbackDialog);
	const [message, setMessage] = useState(null);

	const handleMessageChange = event => {
		var mystring = event.target.value;
		setMessage(mystring);
	};

	function closeFeedbackDialog() {
		dispatch(Actions.closeFeedbackDialog());
	}

	const submitFeedback = async () => {
	
		const collectionRequestBody = {
			message
		};
	
		axios
			.post('/feedback', collectionRequestBody)
			.then(response => {
				dispatch(Actions.closeFeedbackDialog());
				dispatch(Actions.getFeedbacks());
				dispatch(
					MessageActions.showMessage({
						message: 'Submitted Successfully...', //text or html
						autoHideDuration: 6000, //ms
						anchorOrigin: {
							vertical: 'top', //top bottom
							horizontal: 'right' //left center right
						},
						variant: 'success' //success error info warning null
					})
				);
			})
			.catch(error => {
				console.log(error);
			});
	};
	

	return (
		<Dialog
		{...feedbackDialog.props}
			onClose={closeFeedbackDialog}
			fullWidth
			maxWidth="sm"
			classes={{ paper: classes.dialogPaper }}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Feedback
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0' }}>
				<div className="px-16 sm:px-24 flex flex-col">
					<Typography className="py-16 text-18 font-500">
						Please provide your feedback
					</Typography>

					<TextField
						id="message"
						label="message"
						helperText={'Enter the feedback message '}
						value={message}
						onChange={handleMessageChange}
						required={true}
					/>
					
				</div>
			</DialogContent>

			<DialogActions className="justify-end p-8">
				<div className="px-16">
				<Button
							variant="contained"
							color="primary"
							onClick={submitFeedback}
							className={clsx(classes.button, 'flex self-end')}
							disabled={message === ''}
						>
							Submit
						</Button>

				</div>
				<div className="px-16">
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							closeFeedbackDialog();
						}}
					>
						Close
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}

export default FeedbackDialog;
