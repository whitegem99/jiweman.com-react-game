import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Bar } from 'react-chartjs-2';
import _ from '@lodash';
import * as Actions from '../store/actions/transactions.actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import 'chartjs-plugin-colorschemes';
import FilterDialog from '../FilterDialog';

function Widget13(props) {
    const chartData = _.objectToChartDataSet(props.widget.chartData);
    const { data: { startDate = '', endDate = '', type = '' } = {} } = useSelector(({ projectDashboardApp }) => projectDashboardApp.transactions.dialog)
    const [open, openDialog] = useState(false);
    const dispatch = useDispatch();

    const toggleDialog = () => {
        openDialog(!open)
    }

    useEffect(() => {
        dispatch(Actions.getTransactions());
    }, []);

	return (
		<Paper className="w-full rounded-8 shadow-none border-1">
			<div className="flex items-center justify-between px-16 h-64 border-b-1">
                <Typography className="text-16">
                    {props.widget.title} &nbsp;
                    <small>
                        Date: {moment(startDate).format('YYYY-MM-DD : HH:MM A')} - { moment(endDate).format('YYYY-MM-DD : HH:MM A') }
                    </small>
                </Typography>
                <Button variant="outlined" onClick={() => toggleDialog()}>Filters</Button>
			</div>
            <div className="h-400 w-full p-32">
                <Bar
                    data={{
                        labels: chartData.labels,
                        datasets: [{
                            data: chartData.data,
                        }]
                    }}
                    options={{
                        spanGaps: false,
                        legend: {
                            display: false,
                            position: 'bottom',
                            labels: {
                                padding: 16,
                                usePointStyle: true
                            }
                        },
                        maintainAspectRatio: false,
                        plugins: {
                            colorschemes: {
                                scheme: 'brewer.SetThree12'
                            }
                        }
                    }}
                />
            </div>
            <FilterDialog title='Transactions Filter' open={open} toggleDialog={toggleDialog} getFilteredData={Actions.getTransactions} />
		</Paper>
	);
}

export default React.memo(Widget13);
