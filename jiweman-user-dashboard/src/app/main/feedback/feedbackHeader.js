import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import { Button } from '@material-ui/core';
import FeedbackDailog from './feedbackDialog'

function FeedbackHeader(props) {
	const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
	const dispatch = useDispatch();

	
	return (
		<ThemeProvider theme={mainTheme}>
			<div className="flex flex-1 w-full items-center justify-between">
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">shopping_basket</Icon>
					</FuseAnimate>

					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
							Feedback
						</Typography>
					</FuseAnimate>
				</div>

				<div className="flex items-center">
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Button
							onClick={() => {
								dispatch(Actions.openFeedbackDialog());
							}}
							
							className="whitespace-no-wrap normal-case ml-12"
							variant="contained"
							color="secondary"
						>
							<span>Submit Feedback</span>
						</Button>
					</FuseAnimate>
				</div>

				<FeedbackDailog></FeedbackDailog>
			</div>
		</ThemeProvider>
		
	);
}

export default FeedbackHeader;
