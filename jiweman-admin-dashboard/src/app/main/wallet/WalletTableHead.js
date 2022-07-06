import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import React, { useState } from 'react';

const rows = [
	{
		id: '_id',
		align: 'left',
		disablePadding: false,
		label: 'ID',
		sort: false
	},
	{
		id: 'reference',
		align: 'left',
		disablePadding: false,
		label: 'Reference',
		sort: false
	},
	{
		id: 'action',
		align: 'left',
		disablePadding: false,
		label: 'Action',
		sort: false
	},
	{
		id: 'amount',
		align: 'right',
		disablePadding: false,
		label: 'Amount',
		sort: false
	},
	{
		id: 'reason',
		align: 'left',
		disablePadding: false,
		label: 'Reason',
		sort: false
	},
	{
		id: 'date',
		align: 'left',
		disablePadding: false,
		label: 'Date',
		sort: false
	}
];

const useStyles = makeStyles(theme => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
}));

function OrdersTableHead(props) {
	const classes = useStyles(props);
	const [selectedOrdersMenu, setSelectedOrdersMenu] = useState(null);

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	function openSelectedOrdersMenu(event) {
		setSelectedOrdersMenu(event.currentTarget);
	}

	function closeSelectedOrdersMenu() {
		setSelectedOrdersMenu(null);
	}

	// const {onSelectAllClick, order, orderBy, numSelected, rowCount} = props;

	return (
		<TableHead>
			<TableRow className="h-64">
				{rows.map(row => {
					return (
						<TableCell
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props.order.id === row.id ? props.order.direction : false}
						>

							{row.label}
							{/* {row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props.order.id === row.id}
										direction={props.order.direction}
										onClick={createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)} */}
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
}

export default OrdersTableHead;
