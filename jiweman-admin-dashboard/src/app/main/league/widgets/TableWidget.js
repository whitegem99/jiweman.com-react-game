import React from 'react';
import Table from '../../../fuse-layouts/shared-components/Table';
import moment from 'moment';
import { Paper, IconButton, Tooltip, Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

function TableWidget(props) {
	const { /*deleteFn,*/ editFn, processFn, openPrizePanel } = props;
	const columns = React.useMemo(
		() => [
			{
				Header: 'No.',
				Cell: props => <div> {props.row.index + 1}. </div>
			},
			{
				Header: 'Leage Name',
				accessor: 'leagueName',
				sortable: true
			},
			{
				Header: 'Type',
				accessor: 'leagueType',
				sortable: true
			},
			{
				Header: 'Game Region Type',
				accessor: 'gameRegionType',
				sortable: true
			},
			{
				Header: 'Game Currency',
				accessor: 'gameCurrency',
				sortable: true
			},
			{
				Header: 'Brand',
				accessor: 'brandId',
				sortable: true
			},
			{
				Header: 'Entry Fee',
				accessor: 'entryFee'
			},
			{
				Header: 'Game Count',
				accessor: 'gameCount'
			},
			{
				Header: 'Prize',
				accessor: 'prize',
				Cell: props => (
					<div>
						{/* {props.value.map((p, key) => (
							<React.Fragment key={key}>
								<span>${p}</span>
								<br />
							</React.Fragment>
						))} */}
						<Button onClick={() => openPrizePanel(props.row.original)}>View Prize ({props.value.length})</Button>
					</div>
				)
			},
			{
				Header: 'Currency Conv. Risk %',
				accessor: 'currencyConversionRisk'
			},
			{
				Header: 'Prize Distribution Type',
				accessor: 'prizeDistributionType'
			},

			{
				Header: 'Jiweman Entry Fee Commission %',
				accessor: 'jiwemanCommisionPercentage'
			},

			{
				Header: 'Sponser Prize Amount',
				accessor: 'sponsorPrizeAmount'
			},
			{
				Header: 'Prize Pool. %',
				accessor: 'prizePoolPercentage'
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
				Header: 'Sale Start Date',
				accessor: 'startSaleDate',
				sortable: true,
				Cell: props => (
					<div>
						{moment(props.value).utc().format('ll')} <br></br>
						{moment(props.value).utc().format('LT')}
					</div>
				)
			},
			{
				Header: 'Sale End Date',
				accessor: 'endSaleDate',
				sortable: true,
				Cell: props => (
					<div>
						{moment(props.value).utc().format('ll')} <br></br>
						{moment(props.value).utc().format('LT')}
					</div>
				)
			},
			{
				Header: 'Start Date',
				accessor: 'startDate',
				sortable: true,
				Cell: props => (
					<div>
						{moment(props.value).utc().format('ll')} <br></br>
						{moment(props.value).utc().format('LT')}
					</div>
				)
			},
			{
				Header: 'End Date',
				accessor: 'endDate',
				sortable: true,
				Cell: props => (
					<div>
						{moment(props.value).utc().format('ll')} <br></br>
						{moment(props.value).utc().format('LT')}
					</div>
				)
			},

			{
				Header: 'Status',
				accessor: 'leagueStatus',
				sortable: true
			},
			{
				Header: 'Actionables',
				Cell: props => {
					return (
						<div>
							<Tooltip title="Process Winnings">
								<span>
									<IconButton
										disabled={props.row.original.leagueStatus !== 'closed'}
										aria-label="Process"
										onClick={() => processFn(props.row.original)}
									>
										<Icon>payments</Icon>
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Edit">
								<span>
									<IconButton
										disabled={['closed', 'ended'].includes(props.row.original.leagueStatus)}
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
