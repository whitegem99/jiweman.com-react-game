import { Paper, Tooltip, IconButton, Icon } from '@material-ui/core';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';

function PrizeConfigTable(props) {
	const { editFn, deleteFn } = props;

	const columns = React.useMemo(
		() => [
			{
				Header: 'Prize Count',
				accessor: 'position'
				// sortable: true,
				// Cell: props => <div> {props.row.index + 1}. </div>
			},
			{
				Header: 'Prize Allocation By Position',
				accessor: 'allocation',
				// sortable: true,
				Cell: props => (
					<div>
						{props.value.map((item, index) => {
							return (
								<div>
									<span>{index + 1}. &nbsp;</span>
									<span>{item}</span>
								</div>
							);
						})}
					</div>
				)
			},
			{
				Header: 'Actionables',
				Cell: props => {
					return (
						<div>
							<Tooltip title="Edit">
								<span>
									<IconButton aria-label="Edit" onClick={() => editFn(props.row.original)}>
										<Icon>edit</Icon>
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Delete">
								<span>
									<IconButton aria-label="Edit" onClick={() => deleteFn(props.row.original)}>
										<Icon>delete</Icon>
									</IconButton>
								</span>
							</Tooltip>
						</div>
					);
				}
			}
		],
		[editFn, deleteFn]
	);

	return (
		<Paper className="w-full rounded-16">
			<Table columns={columns} data={props.data} text={props.text} />
		</Paper>
	);
}

export default React.memo(PrizeConfigTable);
