import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';
import moment from 'moment';
import { Paper, IconButton, Tooltip } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

function TableWidget(props) {
	const { /*deleteFn,*/ editFn, processFn } = props;
	const columns = React.useMemo(
		() => [
			{
				Header: 'No.',
				Cell: props => <div> {props.row.index + 1}. </div>
			},
			{
				Header: 'Name',
				accessor: 'gameName',
				sortable: true
			},
			{
				Header: 'Game Region Type',
				accessor: 'gameRegionType',
				sortable: true
			},
			{
				Header: 'Entry Fee',
				accessor: 'entryFee'
			},
			{
				Header: 'No of Goals To Win',
				accessor: 'numberOfGoalsToWin'
			},
			{
				Header: 'Prize',
				accessor: 'prize',
				Cell: props => (
					<div>
						<span>{props.value}</span>
					</div>
				)
			},
			{
				Header: 'Currency Conv. Risk %',
				accessor: 'currencyConversionRisk'
			},
			{
				Header: 'Jiweman Commision Percentage',
				accessor: 'jiwemanCommisionPercentage'
			},
			{
				Header: 'Stake Amount',
				accessor: 'stakeAmount'
			},
			{
				Header: 'Sales Tax',
				accessor: 'salesTax'
			},
			{
				Header: 'Winning Tax',
				accessor: 'winningTax'
			},
			{
				Header: 'Tax On Stake Of Bet',
				accessor: 'taxOnStakeOfBet'
			},
			{
				Header: 'Betting Company Commision Percentage',
				accessor: 'bettingCompanyCommisionPercentage'
			},
			{
				Header: 'Tax On Gross Sale',
				accessor: 'taxOnGrossSale'
			},
			{
				Header: 'Tax On Betting Stake',
				accessor: 'taxOnBettingStake'
			},
			{
				Header: 'Betting Company Commission',
				accessor: 'bettingCompanyCommission'
			},
			{
				Header: 'Gameplay Winnings Amount To Be Won Per Bet',
				accessor: 'gameplayWinningsAmountToBeWonPerBet'
			},
			{
				Header: 'Jiweman Commision',
				accessor: 'jiwemanCommision'
			},
			{
				Header: 'Countries',
				accessor: 'allowedCountries',
				Cell: props => (
					<div>
						{props.value.map((p, key) => (
							<React.Fragment key={key}>
								<span>{p}</span>
								<br />
							</React.Fragment>
						))}
					</div>
				)
			},
			{
				Header: 'Status',
				accessor: 'status',
				sortable: true
			},
			{
				Header: 'Actionables',
				Cell: props => {
					return (
						<div>
							<Tooltip title="Edit">
								<span>
									<IconButton
										// disabled={['closed', 'ended'].includes(props.row.original.status)}
										aria-label="Edit"
										onClick={() => editFn(props.row.original)}
									>
										<Icon>edit</Icon>
									</IconButton>
								</span>
							</Tooltip>
						</div>
					);
				}
			}
		],
		[editFn, processFn]
	);

	return (
		<Paper className="w-full rounded-16">
			<Table columns={columns} data={props.data} text={props.text} />
		</Paper>
	);
}

export default React.memo(TableWidget);
