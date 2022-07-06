import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import * as Actions from './store/actions';
import OrdersTableHead from './WalletTableHead';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Typography } from '@material-ui/core';

function OrdersTable(props) {
	const dispatch = useDispatch();
	const wallet = useSelector(({ wallet }) => wallet.wallet);
	const walletCurrency = useSelector(({ wallet }) => wallet.wallet.walletCurrency);

	// const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);

	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(wallet.walletHistory);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	const routeParams = useParams();

	useDeepCompareEffect(() => {
		dispatch(Actions.getWalletHistory(routeParams));
	}, [dispatch, routeParams]);

	// useEffect(() => {
	// 	if (searchText.length !== 0) {
	// 		setData(FuseUtils.filterArrayByString(orders, searchText));
	// 		setPage(0);
	// 	} else {
	// 		setData(orders);
	// 	}
	// }, [orders, searchText]);

	if (wallet.loading) {
		return <FuseLoading />;
	}

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/apps/e-commerce/orders/${item.id}`);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table className="min-w-xl" aria-labelledby="tableTitle">
					<OrdersTableHead
						numSelected={selected.length}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={wallet.walletHistory.length}
					/>

					<TableBody>
						{
							wallet.walletHistory && wallet.walletHistory.length > 0 ?
								wallet.walletHistory.map(n => {
									return (
										<TableRow
											className="h-64 cursor-pointer"
											hover
											tabIndex={-1}
											key={n._id}
										// onClick={event => handleClick(n)}
										>
											<TableCell component="th" scope="row">
												{n._id}
											</TableCell>

											<TableCell component="th" scope="row">
												{n.reference}
											</TableCell>

											<TableCell className="truncate" component="th" scope="row">
												{n.operation}
											</TableCell>

											<TableCell component="th" scope="row" align="right">
												{n.amount} {walletCurrency}
											</TableCell>

											<TableCell component="th" scope="row">
												{n.reason}
											</TableCell>

											<TableCell component="th" scope="row">
												{n.createdAt}
											</TableCell>
										</TableRow>
									);
								})
								:
								<>
									<Typography>
										No Transactions yet
									</Typography>
								</>		
						}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="overflow-hidden"
				component="div"
				count={wallet.walletHistory.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(OrdersTable);
