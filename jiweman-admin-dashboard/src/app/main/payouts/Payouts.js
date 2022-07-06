import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Icon, Input, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import TableWidget from './widgets/TableWidget';

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
	}
}));

function PayoutsPage(props) {
	const dispatch = useDispatch();
	const payouts = useSelector(({ PayoutsPage }) => PayoutsPage.payouts);
	console.log(payouts)
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [searchText, setSearchText] = useState(null);
	useEffect(() => {
		dispatch(Actions.getPayouts({ page: 0, limit: 10 }));
	}, [dispatch]);

	console.log(payouts)
	
	if (payouts.loading) {
		return <FuseLoading />;
	}

	if (!payouts || !payouts.data) {
		return null;
	}

	function handlePageChange(limit, page) {
		dispatch(Actions.getPayouts({ limit, page }));
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-160 h-160',
				toolbar: 'min-h-48 h-48',
				rightSidebar: 'w-288',
				content: classes.content
			}}
			content={
				<div className="p-12 pb-64">
					<FuseAnimate animation="transition.slideUpIn">
						<div className="flex flex-col md:flex-row sm:p-8 container">
							<div className="flex flex-1 flex-col min-w-0">
								<FuseAnimate delay={600}>
									<div className="flex justify-between flex-row min-w-0 p-16 pb-8">
										<Typography className=" text-18 font-300">List of your payouts</Typography>
										<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8">
											<Icon color="action">search</Icon>

											<Input
												placeholder="Search"
												className="flex flex-1 mx-8"
												disableUnderline
												fullWidth
												onChange={e => setSearchText(e.target.value || null)}
												inputProps={{
													'aria-label': 'Search'
												}}
											/>
										</Paper>
									</div>
								</FuseAnimate>

								<FuseAnimateGroup
									className="flex flex-wrap"
									enter={{
										animation: 'transition.slideUpBigIn'
									}}
								>
									<div className="widget flex w-full p-12">
										<TableWidget
											text={searchText}
											data={payouts.data.docs}
											total={payouts.data.total}
											pageChange={handlePageChange}
										/>
									</div>
								</FuseAnimateGroup>
							</div>
						</div>
					</FuseAnimate>
				</div>
			}
			ref={pageLayout}
		/>
	);
}

export default withReducer('PayoutsPage', reducer)(PayoutsPage);
