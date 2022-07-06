import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import TransactionTable from './widgets/TransactionTable';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
	selectedProject: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '8px 0 0 0'
	},
	projectMenuButton: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '0 8px 0 0',
		marginLeft: 1
	},
	badge: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.getContrastText(theme.palette.error.main)
	}
}));

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	// const user = useSelector(({ auth }) => auth.user);
	const transactions = useSelector(({ transactionsPage }) => transactionsPage.transactions);
	// const [tabValue, setTabValue] = useState(0);
	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(Actions.getTransactionHistory());
	}, [dispatch]);

	// function handleChangeTab(event, value) {
	// 	setTabValue(value);
	// }

	if (transactions.loading) {
		return <FuseLoading />;
	}

	if (!transactions.data) {
		return null;
	}

	return (
		<>
			<FusePageSimple
				classes={{
					header: 'min-h-60 h-60',
					toolbar: 'min-h-48 h-48',
					rightSidebar: 'w-288',
					content: classes.content
				}}
				content={
					<div className="p-4 pb-64">
						<FuseAnimate animation="transition.slideUpIn">
							<div className="flex flex-col md:flex-row sm:p-4 container">
								<div className="flex flex-1 flex-col min-w-0">
									<FuseAnimate delay={600}>
										<Typography className="p-16 py-8 text-18 font-300">
											My Transaction History
										</Typography>
									</FuseAnimate>
									<FuseAnimateGroup
										className="flex flex-wrap"
										enter={{
											animation: 'transition.slideUpBigIn'
										}}
									>
										<div className="widget flex w-full p-12">
											<TransactionTable data={transactions.data} />
										</div>
									</FuseAnimateGroup>
								</div>
							</div>
						</FuseAnimate>
					</div>
				}
				ref={pageLayout}
			/>
		</>
	);
}

export default withReducer('transactionsPage', reducer)(ProjectDashboardApp);
