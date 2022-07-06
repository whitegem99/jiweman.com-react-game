import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import reducer from './store/reducers';
import FeedbackHeader from './feedbackHeader'
import _ from '@lodash';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import moment from 'moment';
import MessageSidePanel from './messagePanel';
import Typography from '@material-ui/core/Typography';
import Chip from './chip';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({

	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	},
	color: {
		width: 8,
		height: 8,
		marginRight: 4,
		borderRadius: '50%'
	},
	mailItem: {
		borderBottom: `1px solid  ${theme.palette.divider}`,

		'&.unread': {
			background: 'rgba(0,0,0,0.03)'
		},
		'&.selected': {
			'&::after': {
				content: '""',
				position: 'absolute',
				left: 0,
				display: 'block',
				height: '100%',
				width: 3,
				backgroundColor: theme.palette.primary.main
			}
		}
	}
}));



function ProjectDashboardApp(props) {

	const classes = useStyles();
	const dispatch = useDispatch();
	const feedbacks = useSelector(({ feedbacks }) => feedbacks.feedbacks);

	useEffect(() => {
		dispatch(Actions.getFeedbacks());
	}, [dispatch]);


	return (
		<>
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<FeedbackHeader />}
				content={
					<>
						<List className={classes.root}>
							{feedbacks.data && feedbacks.data.length > 0 ? feedbacks.data.map(_item => (
								<ListItem
									onClick={() => {
										dispatch(Actions.toggleMessageListPanelOpen(_item));
									}}
									className={clsx(
										classes.mailItem,
										'py-16 px-0 md:px-8'
									)}
								>
									<div className="flex flex-1 flex-col relative overflow-hidden">

										<div className="flex flex-col px-16 py-0">
											{/* <Typography className="truncate">{props.mail.subject}</Typography> */}
											<Typography color="textSecondary" className="truncate">
												{_.truncate(_item.messages[0].message.replace(/<(?:.|\n)*?>/gm, ''), { length: 180 })}
											</Typography>
										</div>

										<div className="flex justify-end px-12">
											<Typography variant="subtitle1">{moment(_item.createdAt).format('ll')}</Typography>

											<Chip
												className="mx-2 mt-4"
												title={_item.status}
												color={_item.status === "Initiated" ? "blue" : _item.status === "Active" ? "green" : "red" }
												key={_item.status}
											/>

										</div>
									</div>

								</ListItem>

							)) : (
								<div className="flex flex-col flex-1">
									
									<Typography className="px-24 pb-24 text-center" color="textSecondary">
										No existing feedback found.
						</Typography>
								</div>
							)}
						</List>
						<MessageSidePanel></MessageSidePanel>
					</>

				}
				innerScroll
			/>


		</>
	);
}

export default withReducer('feedbacks', reducer)(ProjectDashboardApp);
