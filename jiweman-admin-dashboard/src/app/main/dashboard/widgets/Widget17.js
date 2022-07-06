import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Line, Bar } from 'react-chartjs-2';
import _ from '@lodash';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import * as Actions from '../store/actions/deposits.actions';
import 'chartjs-plugin-colorschemes';
import FilterDialog, { FILTER_TYPE } from '../FilterDialog';

function Widget17(props) {
    const chartData = _.objectToChartDataSet(props.widget.chartData);
    const { data: { startDate = '', endDate = '', type = '' } = {} } = useSelector(({ projectDashboardApp }) => projectDashboardApp.deposits.dialog)
    const [open, openDialog] = useState(false);
    const dispatch = useDispatch();

    const toggleDialog = () => {
        openDialog(!open)
    }

    useEffect(() => {
        dispatch(Actions.getDepositsHistory())
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

                {/* <Line
                    data={{
                        labels: chartData.labels,
                        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [{
                            label: `Sum`,
                            data: chartData.data.length ? [chartData.data?.[0]] : [0],
                            // data: [33, 53, 85, 41, 44, 65],
                            fill: true,
                            backgroundColor: "rgba(75,192,192,0.2)",
                            borderColor: "rgba(75,192,192,1)",
                            hoverRadius: 5,
                        },
                        {
                            label: `Average`,
                            data: chartData.data.length ? [chartData.data?.[1]] : [0],
                            // data: [33, 53, 85, 41, 44, 65],
                            fill: true,
                            backgroundColor: "rgba(141,51,255, 0.2)",
                            borderColor: "#8D33FF",
                            hoverRadius: 5,
                        },  
                        // {
                        //     label: 'Deposits for Single Player',
                        //     // data: chartData.data,
                        //     data: [10, 5, 40, 90, 0, 30],
                        //     fill: true,
                        //     backgroundColor: "rgba(141,51,255, 0.2)",
                        //     borderColor: "#8D33FF",
                        //     hoverRadius: 5
                        // }
                        ]
                    }}
                    options={{
                        spanGaps: false,
                        legend: {
                            // display: false,
                            position: 'top',
                            labels: {
                                fontSize: 10,
                                padding: 16,
                                usePointStyle: true
                            }
                        },
                        maintainAspectRatio: false,
                        // plugins: {
                        //     colorschemes: {
                        //         scheme: 'brewer.SetThree12'
                        //     }
                        // }
                    }}
                /> */}
            </div>
            <FilterDialog title={`${props.widget.title} Filter`} open={open} toggleDialog={toggleDialog} getFilteredData={Actions.getDepositsHistory} type={FILTER_TYPE.DEPOSIT} />
		</Paper>
	);
}

export default React.memo(Widget17);
