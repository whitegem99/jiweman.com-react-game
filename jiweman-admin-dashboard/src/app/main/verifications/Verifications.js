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

function VerificationsPage(props) {
	const dispatch = useDispatch();
	const verifications = useSelector(({ verificationsPage }) => verificationsPage.verifications);
	console.log(verifications);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [searchText, setSearchText] = useState(null);
	useEffect(() => {
		dispatch(Actions.getVerifications({ page: 0, limit: 10 }));
	}, [dispatch]);

	if (verifications.loading) {
		return <FuseLoading />;
	}

	if (!verifications.data) {
		return null;
	}

	function handlePageChange(limit, page) {
		dispatch(Actions.getVerifications({ limit, page }));
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
										<Typography className=" text-18 font-300">List of verifications</Typography>
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
											data={verifications.data.docs}
											total={verifications.data.total}
											pageChange={handlePageChange}
											verifyFn={ob => {
												dispatch(Actions.verifyId(ob.verificationId._id));
											}}
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

export default withReducer('verificationsPage', reducer)(VerificationsPage);
