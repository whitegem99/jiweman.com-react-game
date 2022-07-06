import { Paper } from '@material-ui/core';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';


function Widget11(props) {
	const columns = React.useMemo(
		() => [
			{
				Header: 'No.',
				// accessor: 'userName',
				// sortable: true,
				Cell: props => <div> {props.row.index + 1}. </div>
			},
			{
				Header: (<div>Each Game <br />Played Points</div>),
				accessor: 'played',
				// sortable: true
			},
			{
				Header: <div>Each Game <br /> Win Points</div>,
				accessor: 'win',
				// sortable: true
			},
			{
				Header: <div>Each Game <br /> Loss Points</div>,
				accessor: 'loss',
				// sortable: true
			},
			{
				Header: <div>Each Goal <br /> For Points</div>,
				accessor: 'goalFor',
				// sortable: true
			},
			{
				Header: <div>Each Goal <br /> Against Points</div>,
				accessor: 'goalAgainst',
				// sortable: true,
			},
			{
				Header: <div>Each Clean <br /> Sheet Points</div>,
				accessor: 'cleanSheet',
				// sortable: true
			},
			{
				Header: <div>Each Goal <br /> Difference Points</div>,
				accessor: 'goalDifference',
				// sortable: true
			}
		],
		[]
	);

	return <Paper className="w-full rounded-16"><Table columns={columns} data={props.data} text={props.text} /></Paper>;
}


export default React.memo(Widget11);
