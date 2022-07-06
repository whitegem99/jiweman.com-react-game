import { Paper, Tooltip, IconButton, Icon } from '@material-ui/core';
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
	const { verifyFn } = props;
	const columns = React.useMemo(
		() => [
			// {
			// 	Header: 'ID',
			// 	accessor: 'verificationId._id',
			// 	sortable: true
			// },
			{
				Header: 'UserName',
				accessor: 'userName',
				sortable: true
			},
			{
				Header: 'ID Type',
				accessor: 'verificationId.id_type',
				sortable: true
			},
			{
				Header: 'ID Number',
				accessor: 'verificationId.id_number',
				sortable: true
			},
			{
				Header: 'ID Proof Link',
				accessor: 'verificationId.id_photo',
				sortable: true,
				Cell: props => (
					<div>
						{' '}
						<a href={props.value} target="_blank">
							Link
						</a>{' '}
					</div>
				)
			},
			{
				Header: 'Selfie Link',
				accessor: 'verificationId.selfie',
				sortable: true,
				Cell: props => (
					<div>
						{' '}
						<a href={props.value} target="_blank">
							Link
						</a>{' '}
					</div>
				)
			},
			{
				Header: 'Status',
				accessor: 'verificationId.status',
				sortable: true
			},

			{
				Header: 'Updated At',
				accessor: 'verificationId.updatedAt',
				sortable: true,
				Cell: props => <div> {moment(props.value).utc().format('lll')} </div>
			},
			{
				Header: 'Actionables',
				sortable: true,
				Cell: props => {
					return (
						<div>
							<Tooltip title="Mark Verified">
								<span>
									<IconButton aria-label="verify" onClick={() => verifyFn(props.row.original)}>
										<Icon>check</Icon>
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
