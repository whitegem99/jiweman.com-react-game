import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

const PaginatedTable = ({ columns, data, text, total, getDataForPageChange }) => {
	console.log(total);
	const {
		getTableProps,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		setPageSize,
		setGlobalFilter,
		state: { pageIndex, pageSize }
	} = useTable(
		{
			columns,
			data,
			autoResetPage: false,
			manualPagination: true, // Tell the usePagination,
			// pageCount: total,
			initialState: {
				pageSize: 10,
				pageIndex: 0
			}
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect
		// hooks => {
		//     hooks.allColumns.push(_columns => [
		//         // Let's make a column for selection
		//         {
		//             id: 'selection',
		//             sortable: false,
		//             // The header can use the table's getToggleAllRowsSelectedProps method
		//             // to render a checkbox.  Pagination is a problem since this will select all
		//             // rows even though not all rows are on the current page.  The solution should
		//             // be server side pagination.  For one, the clients should not download all
		//             // rows in most cases.  The client should only download data for the current page.
		//             // In that case, getToggleAllRowsSelectedProps works fine.
		//             Header: ({ getToggleAllRowsSelectedProps }) => (
		//                 <div>
		//                     <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
		//                 </div>
		//             ),
		//             // The cell can use the individual row's getToggleRowSelectedProps method
		//             // to the render a checkbox
		//             Cell: ({ row }) => (
		//                 <div>
		//                     <IndeterminateCheckbox
		//                         {...row.getToggleRowSelectedProps()}
		//                         onClick={ev => ev.stopPropagation()}
		//                     />
		//                 </div>
		//             )
		//         },
		//         ..._columns
		//     ]);
		// }
	);

	const handleChangePage = (event, newPage) => {
		gotoPage(newPage);
		getDataForPageChange(pageSize, newPage);
	};

	const handleChangeRowsPerPage = event => {
		setPageSize(Number(event.target.value));
		gotoPage(0);
		getDataForPageChange(Number(event.target.value), 0);
	};

	useEffect(() => {
		setGlobalFilter(text);
	}, [setGlobalFilter, text]);

	// Render the UI for your table
	return (
		<TableContainer className="min-h-full sm:border-1 sm:rounded-16">
			<MaUTable {...getTableProps()}>
				<TableHead>
					{headerGroups.map(headerGroup => (
						<TableRow {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<TableCell
									className="whitespace-no-wrap p-12"
									{...(!column.sortable
										? column.getHeaderProps()
										: column.getHeaderProps(column.getSortByToggleProps()))}
								>
									{column.render('Header')}
									{column.sortable ? (
										<TableSortLabel
											active={column.isSorted}
											// react-table has a unsorted state which is not treated here
											direction={column.isSortedDesc ? 'desc' : 'asc'}
										/>
									) : null}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableHead>
				<TableBody>
					{!!page.length &&
						page.map((row, i) => {
							prepareRow(row);
							return (
								<TableRow
									{...row.getRowProps()}
									//  onClick={ev => onRowClick(ev, row)}
									className="truncate cursor-pointer"
								>
									{row.cells.map(cell => {
										return (
											<TableCell
												{...cell.getCellProps()}
												className={clsx('p-12', cell.column.className)}
											>
												{cell.render('Cell')}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					{!!!data.length && (
						<TableRow className="truncate cursor-pointer">
							<TableCell className={clsx('p-12')}>No Data Available</TableCell>
						</TableRow>
					)}
				</TableBody>

				<TableFooter>
					<TableRow>
						<TablePagination
							classes={{
								root: 'overflow-hidden',
								spacer: 'w-0 max-w-0'
							}}
							rowsPerPageOptions={[10, 20, 30]}
							colSpan={columns.length}
							count={total}
							rowsPerPage={pageSize}
							page={pageIndex}
							SelectProps={{
								inputProps: { 'aria-label': 'rows per page' },
								native: false
							}}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
							// ActionsComponent={ContactsTablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</MaUTable>
		</TableContainer>
	);
};

PaginatedTable.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func
};

export default PaginatedTable;
