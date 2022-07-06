import { AppBar, Divider, Paper, Toolbar } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions/index';
import FuseLoading from '@fuse/core/FuseLoading';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import axios from 'axios';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
	root: {
		width: 500
	},
	messageRow: {
		'&.contact': {
			'& .bubble': {
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.getContrastText(theme.palette.background.paper),
				borderTopLeftRadius: 5,
				borderBottomLeftRadius: 5,
				borderTopRightRadius: 20,
				borderBottomRightRadius: 20,
				'& .time': {
					marginLeft: 12
				}
			},
			'&.group': {
				paddingTop: 43,
				'& .bubble': {
					borderTopLeftRadius: 20,
					borderBottomLeftRadius: 20
				}

			}
		},
		'&.me': {
			paddingLeft: 40,

			'& .avatar': {
				order: 2,
				margin: '0 0 0 16px'
			},
			'& .bubble': {
				marginLeft: 'auto',
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
				borderTopLeftRadius: 20,
				borderBottomLeftRadius: 20,
				borderTopRightRadius: 5,
				borderBottomRightRadius: 5,
				'& .time': {
					justifyContent: 'flex-end',
					right: 0,
					marginRight: 12
				}
			},
			'&.group': {
				paddingTop: 43,
				'& .bubble': {
					borderTopRightRadius: 20,
					borderBottomRightRadius: 20
				}
			}
		},
		'&.contact + .me, &.me + .contact': {
			paddingTop: 20,
			marginTop: 20
		},
		'&.group': {
			'& .bubble': {
				borderTopLeftRadius: 20,
				paddingTop: 13,
				borderBottomLeftRadius: 20,
				paddingBottom: 13,
				'& .time': {
					display: 'flex'
				}
			}
		}
	}
}));

function MessageSidePanel(props) {
	const dispatch = useDispatch();
	const state = useSelector(({ feedbacks }) => {
		return feedbacks.feedbacks.messagePanel.state;
	});

	let messageData = useSelector(({ feedbacks }) => feedbacks.feedbacks.messagePanel.messageData);

	const classes = useStyles();
	const chatRef = useRef(null);
	const [messageText, setMessageText] = useState('');
	const [isClose, setIsClose] = useState(false);

	// useEffect(() => {
	// 	if (messageData) {
	// 		scrollToBottom();
	// 	}
	// }, [messageData]);

	// function isFirstMessageOfGroup(item, i) {
	// 	return i === 0 || (messageData[i - 1] && messageData[i - 1].who !== item.who);
	// }

	// function isLastMessageOfGroup(item, i) {
	// 	return i === messageData.length - 1 || (messageData[i + 1] && messageData[i + 1].who !== item.who);
	// }

	function scrollToBottom() {
		chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}

	function onInputChange(ev) {
		setMessageText(ev.target.value);
	}

	function onMessageSubmit(ev) {
		ev.preventDefault();

		const collectionRequestBody = {
			message: messageText,
			isClose: isClose
		};

		axios
			.post('/feedback/admin/'+messageData._id, collectionRequestBody)
			.then(response => {
				dispatch(Actions.getFeedbacks());
				dispatch(Actions.toggleMessageListPanelClose());
				setMessageText("")
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



	}

	return (
		<Drawer
			classes={{ paper: classes.root }}
			open={state}
			anchor="right"
			// variant="persistent"
			onClose={ev => dispatch(Actions.toggleMessageListPanelClose())}
		>
			{messageData && messageData.messages ? (

				<div className={clsx('flex flex-col relative', props.className)}>
					<FuseScrollbars ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
						{messageData.messages.length > 0 ? (
							<div className="flex flex-col pt-16 px-16 ltr:pl-56 rtl:pr-56 pb-40">
								{messageData.messages.map((item, i) => {
									// const contact =
									// 	item.who === user.id ? user : contacts.find(_contact => _contact.id === item.who);
									return (
										<div
											key={moment(item.timme).format('ll')}
											className={clsx(
												classes.messageRow,
												'flex flex-col flex-grow-0 flex-shrink-0 items-start justify-end relative px-16 pb-4 group',
												{ me: item.from === "Admin" },
												{ contact: item.from === "Player" },
												// { 'first-of-group': isFirstMessageOfGroup(item, i) },
												// { 'last-of-group': isLastMessageOfGroup(item, i) },
												i + 1 === messageData.messages.length && 'pb-96'
											)}
										>

											{item.from === "Player" && (
												<Avatar className="avatar absolute ltr:left-0 rtl:right-0 m-0 -mx-32" />

											)}
											<div className="bubble flex relative items-center justify-center p-12 max-w-full shadow-1">
												<div className="leading-tight whitespace-pre-wrap">{item.message}</div>
												<Typography
													className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-no-wrap"
													color="textSecondary"
												>
													{moment(item.time).format('MMMM Do YYYY, h:mm:ss a')}
												</Typography>
											</div>
										</div>
									);
								})}
							</div>
						) : (
								<div className="flex flex-col flex-1">
									<div className="flex flex-col flex-1 items-center justify-center">
										<Icon className="text-128" color="disabled">
											Feedback
							</Icon>
									</div>
									<Typography className="px-16 pb-24 text-center" color="textSecondary">
										No messages found
						</Typography>
								</div>
							)}
					</FuseScrollbars>
					{messageData && messageData.messages && (
						<form onSubmit={onMessageSubmit} className="absolute bottom-0 right-0 left-0 py-16 px-8">
							<Checkbox type="checkbox" checked={isClose} onChange={setIsClose} /> Close feedback with this message
							<Paper className="flex items-center relative rounded-24" elevation={1}>
								<TextField
									autoFocus={false}
									id="message-input"
									className="flex-1"
									InputProps={{
										disableUnderline: true,
										classes: {
											root: 'flex flex-grow flex-shrink-0 mx-16 ltr:mr-48 rtl:ml-48 my-8',
											input: ''
										},
										placeholder: 'Type your message'
									}}
									InputLabelProps={{
										shrink: false,
										className: classes.bootstrapFormLabel
									}}
									onChange={onInputChange}
									value={messageText}
								/>
								<IconButton disabled={messageText === ''} className="absolute ltr:right-0 rtl:left-0 top-0" type="submit">
									<Icon className="text-24" color="action">
										send
							</Icon>
								</IconButton>
							</Paper>
						</form>
					)}
				</div>
			) : (
					<FuseLoading />
				)}
		</Drawer>
	);
}

export default MessageSidePanel;
