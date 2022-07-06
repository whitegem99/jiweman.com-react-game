import { Paper } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/PaginatedTable';

function TableWidget(props) {
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				sortable: true
			},
			{
				Header: 'League Name',
				accessor: 'league.leagueName'
			},
			{
				Header: 'User Name',
				accessor: 'user.fullName'
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				sortable: true
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
