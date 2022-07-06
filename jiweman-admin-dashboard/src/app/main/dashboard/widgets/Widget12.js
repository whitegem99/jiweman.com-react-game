import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import _ from '@lodash';

import 'chartjs-plugin-colorschemes';

function Widget12(props) {
	const chartData = _.objectToChartDataSet(props.widget.chartData)
	return (
		<Paper className="w-full rounded-8 shadow-none border-1">
			<div className="flex items-center justify-between px-16 h-64 border-b-1">
				<Typography className="text-16">{props.widget.title}</Typography>
			</div>
			<div className="h-400 w-full p-32">
				<Bar
					data={{
						labels: chartData.labels,
						datasets: [{
							data: chartData.data,
							// backgroundColor: ['#E91E63', '#FFC107', '#9C27B0', '#F44336', '#03A9F4', ],
							// hoverBackgroundColor: ['#E9487F', '#FFD341', '#A041B0', '#F45A4D', '#25B6F4', ]
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
		</Paper>
	);
}

export default React.memo(Widget12);
