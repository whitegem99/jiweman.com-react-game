
import moment from 'moment';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/PaginatedTable';
import { Paper, Tooltip, IconButton, Icon } from '@material-ui/core';

function TableWidget(props) {

	const { approveFn, deactivateFn, activateFn } = props;
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: '_id',
				sortable: false
			},
			{
				Header: 'Company Name',
				accessor: 'name',
				sortable: true
			},
			{
				Header: 'Country',
				accessor: 'country'
			},
			{
				Header: 'Status',
				accessor: 'status'
			},
			{
				Header: 'Actionables',
				Cell: props => {
					return (
						<div>
							{props.row.original.status === "Initiated" && <Tooltip title="Approve Company">
								<span>
									<IconButton
										aria-label="approve"
										onClick={() => approveFn(props.row.original)}
									>
										<Icon>check</Icon>
									</IconButton>
								</span>
							</Tooltip>}
							{props.row.original.status === "Active" && <Tooltip title="Deactivate Company">
								<span>
									<IconButton
										aria-label="Deactivate"
										onClick={() => deactivateFn(props.row.original)}
									>
										<Icon>warning</Icon>
									</IconButton>
								</span>
							</Tooltip>}
							{props.row.original.status === "Inactive" && <Tooltip title="Activate Company">
								<span>
									<IconButton
										aria-label="Activate"
										onClick={() => activateFn(props.row.original)}
									>
										<Icon>check_circle</Icon>
									</IconButton>
								</span>
							</Tooltip>}
						</div>
					);
				}
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
