import { Paper, Tooltip, IconButton, Icon, Button } from '@material-ui/core';
import React, { useState } from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';

function AppListTable(props) {
	const { editFn, deleteFn } = props;

	const columns = React.useMemo(
		() => [
			{
				Header: 'App Link',
				accessor: 'appLink',
				Cell: props => {
					return (
						<div>
							<a href={props.value}>Link</a>
						</div>
					);
				}
			},
			{
				Header: 'App Version',
				accessor: 'appVersion'
			},
			{
				Header: 'Supported Version',
				accessor: 'supportedVersion',
				// sortable: true,
				// render: props => <input value={props.row.name} onChange={onChangeFct} />
				Cell: props => {
					console.log(props);

					const [version, setVersion] = useState(props.row.values.supportedVersion);
					return (
						<div>
							<input style={{ width: 40 }} value={version} onChange={e => setVersion(e.target.value)} />
							<Button onClick={() => editFn(version)}>Save</Button>
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

export default React.memo(AppListTable);
