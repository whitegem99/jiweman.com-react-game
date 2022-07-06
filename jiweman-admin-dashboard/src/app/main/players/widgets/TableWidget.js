import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';
import moment from 'moment';
import { Paper, Tooltip, IconButton, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';

function TableWidget(props) {
	const { banFn, unBanFn, warnFn } = props;
	const columns = React.useMemo(
		() => [
			{
				Header: 'User Name',
				accessor: 'userName',
				sortable: true
			},
			{
				Header: 'Name',
				accessor: 'fullName',
				sortable: true
			},
			{
				Header: 'Total Time Spent',
				accessor: 'timespent',
				sortable: true
			},
			{
				Header: 'Median',
				accessor: 'median',
				sortable: true
			},
			{
				Header: 'Total Matches',
				accessor: 'totalmatches',
				sortable: true
			},
			{
				Header: 'Avg Time Spent',
				accessor: 'averagetimeSpent',
				sortable: true,
				Cell: props => <div> {props.value ? parseFloat(props.value).toFixed(2) : null} </div>
			},
			{
				Header: 'Account Type',
				accessor: 'accountType',
				sortable: true
			},
			{
				Header: 'Wallet Balance',
				accessor: 'balance',
				sortable: true,
				Cell: props => <div>
					<span>{props.value + ' '}
					(<Link to={"/wallet/" + props.row.original._id}>View</Link>)
					</span>
				</div>
			},
			{
				Header: 'Gender',
				accessor: 'gender',
				sortable: true
			},
			{
				Header: 'Country',
				accessor: 'countryOfRecidence',
				sortable: true
			},
			{
				Header: 'Birth Date',
				accessor: 'dateOfBirth',
				sortable: true,
				Cell: props => <div> {moment(props.value).utc().format('ll')} </div>
			},
			{
				Header: 'Account Created',
				accessor: 'createdAt',
				sortable: true,
				Cell: props => <div> {moment(props.value).utc().format('lll')} </div>
			},
			{
				Header: 'Warning Count',
				accessor: 'warnCount',
				sortable: true
			},
			{
				Header: 'Actionables',
				Cell: props => {
					return (
						<div>
							{!props.row.original.isUserBanned && <Tooltip title="Ban User">
								<span>
									<IconButton
										aria-label="Ban"
										onClick={() => banFn(props.row.original)}
									>
										<Icon>pan_tool</Icon>
									</IconButton>
								</span>
							</Tooltip>}
							{props.row.original.isUserBanned && <Tooltip title={(<div>Unban<br /> User Was Banned because: {props.row.original.banReason}</div>)}>
								<span>
									<IconButton
										aria-label="Unban"
										onClick={() => unBanFn(props.row.original)}
									>
										<Icon>how_to_reg</Icon>
									</IconButton>
								</span>
							</Tooltip>}
							<Tooltip title="Warn User">
								<span>
									<IconButton
										aria-label="Warn"
										onClick={() => warnFn(props.row.original)}
									>
										<Icon>warning</Icon>
									</IconButton>
								</span>
							</Tooltip>
						</div>
					);
				}
			}
		],
		[]
	);

	return (
		<Paper className="w-full rounded-16">
			<Table columns={columns} data={props.data} text={props.text} />
		</Paper>
	);
}

export default React.memo(TableWidget);
