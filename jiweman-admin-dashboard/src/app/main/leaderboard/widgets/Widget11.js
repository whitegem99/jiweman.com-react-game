import { IconButton, Paper } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';
import _ from '@lodash/index';

function Widget11(props) {
	// const {deleteFn} = props
	const columns = [
		{
			Header: 'Rank',
			// accessor: 'userName',

			Cell: props => <div> {props.row.index + 1}. </div>
		},
		{
			Header: 'Player Name',
			accessor: 'playerName',
			sortable: true
		},
		{
			Header: 'Matches Played',
			accessor: 'matchesPlayed',
			sortable: true
		},
		{
			Header: 'Win',
			accessor: 'win',
			sortable: true
		},
		{
			Header: 'Clean Sheet',
			accessor: 'cleanSheet',
			sortable: true
		},
		{
			Header: 'Lose',
			accessor: 'loss',
			sortable: true
		},
		{
			Header: 'Goal For',
			accessor: 'goalFor',
			sortable: true
		},
		{
			Header: 'Goal Against',
			accessor: 'goalAgainst',
			sortable: true
		},
		{
			Header: 'Goal Difference',
			accessor: 'goalDiff',
			sortable: true
		},
		{
			Header: 'Points',
			accessor: 'points',
			sortable: true
		},
		{
			Header: 'PPM',
			accessor: 'pointsPerMinute',
			sortable: true
		},
		{
			Header: 'Avg PPM',
			accessor: 'avgPointsPerMinute',
			sortable: true
		},
		{
			Header: 'Prize Status',
			accessor: 'prizeStatus',
			Cell: props => {
				if (parseInt(props.row.original.prize, 10) > 1) {
					return props.value;
				}
				return '';
			},
			sortable: true,
			hiddenWhen: ['oneonone', 'active']
		},
		{
			Header: 'Actionables',
			Cell: props => {
				if (parseInt(props.row.original.prize, 10) > 1) {
					return (
						<div>
							<IconButton aria-label="Edit">
								<Icon>send</Icon>
							</IconButton>
						</div>
					);
				}

				return '';
			},
			hiddenWhen: ['oneonone', 'active']
		}
		// eslint-disable-next-line
	].filter(ob => {
		if (
			_.get(ob, 'hiddenWhen', []).includes(props.gameType) ||
			_.get(ob, 'hiddenWhen', []).includes(_.get(props, 'league.leagueStatus', null))
		) {
			// do nothing
		} else {
			return ob;
		}
	});

	return (
		<Paper className="w-full rounded-16">
			<Table columns={columns} data={props.data} text={props.text} />
		</Paper>
	);
}

export default React.memo(Widget11);
