import { Paper } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/PaginatedTable';

/**
 * 
 * 
 * createdAt: "2020-06-21T12:11:31.217Z"
id: 10309867
leagueInfo: "Test League Name"
phonenumber: "+80000000122"
status: "successful"
ticket: ""
userCountry: "Kenya"
userInfo: "testuser3"
_id: "5eef4e73314b7c6d90ef42d8"
 */
function TableWidget(props) {
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				sortable: true
			},
			{
				Header: 'Type',
				accessor: 'collectionType',
				sortable: true
			},
			// {
			// 	Header: 'League Name',
			// 	accessor: 'leagueInfo',
			// 	sortable: true
			// },
			{
				Header: 'Phone Number',
				accessor: 'phonenumber'
				// sortable: true
			},
			{
				Header: 'User Name',
				accessor: 'userInfo',
				sortable: true
			},
			{
				Header: 'User Country',
				accessor: 'userCountry',
				sortable: true
			},
			// {
			// 	Header: 'Ticket',
			// 	accessor: 'ticket',
			// 	sortable: true
			// },
			{
				Header: 'Currency',
				accessor: 'currency',
				sortable: true
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				sortable: true
			},
			{
				Header: 'Status',
				accessor: 'status',
				sortable: true
			},

			{
				Header: 'Created',
				accessor: 'createdAt',
				sortable: true,
				Cell: props => <div> {moment(props.value).utc().format('lll')} </div>
			}
		],
		[]
	);

	return (
		<Paper className="w-full rounded-16">
			<Table
				columns={columns}
				data={props.data}
				total={props.total}
				text={props.text}
				getDataForPageChange={props.pageChange}
			/>
		</Paper>
	);
}

export default React.memo(TableWidget);
