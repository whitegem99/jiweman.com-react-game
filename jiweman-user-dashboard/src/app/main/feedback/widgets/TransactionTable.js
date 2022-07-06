import { Paper } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';

function TransactionTable(props) {
	const columns = React.useMemo(
		() => [
			{
				Header: 'No.',
				Cell: props => <div> {props.row.index + 1}. </div>
			},
			{
				Header: 'Type',
				accessor: 'collectionType',
				sortable: true
			},
			// {
			// 	Header: 'League Name',
			// 	accessor: 'leagueInfo.leagueName',
			// 	sortable: true
			// },
			{
				Header: 'Payment Amount',
				accessor: 'amount',
			},
			{
				Header: 'Currency',
				accessor: 'currency',
			},
			{
				Header: 'Transaction ID',
				accessor: 'id',
			},
			{
				Header: 'Payment Status',
				accessor: 'status',
				sortable: true,
				Cell: props => <div> {props.value.toUpperCase()} </div>
			},
			// {
			// 	Header: 'League Ticket',
			// 	accessor: 'ticket',
			// },
			{
				Header: 'Payment Date',
				accessor: 'createdAt',
				Cell: props => <div> {moment(props.value).format('L')} </div>
			},
			// {
			// 	Header: 'Actionables',
			// 	Cell: props => {
			// 		return (
			// 			<div>
			// 				<IconButton aria-label="Edit" onClick={() => editFn(props.row.original)}>
			// 					<Icon>edit</Icon>
			// 				</IconButton>
			// 				<IconButton aria-label="Delete" onClick={() => deleteFn(props.row)}>
			// 					<Icon>delete</Icon>
			// 				</IconButton>
			// 			</div>
			// 		);
			// 	}
			// }
		],
		[]
	);

	return (
		<Paper className="w-full rounded-16">
			<Table columns={columns} data={props.data} text={props.text} />
		</Paper>
	);
}

export default React.memo(TransactionTable);
