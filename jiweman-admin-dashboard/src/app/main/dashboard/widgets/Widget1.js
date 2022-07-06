import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function Widget1(props) {
	// const theme = useTheme();

	return (
		<Card className="w-full rounded-8 shadow-none border-1">
			<div className="p-16 flex flex-row flex-wrap items-end">
				<div className="">
					<Typography className="h3" color="textSecondary">
						{props.widget.label}
					</Typography>
					<Typography className="text-56 font-300 leading-none mt-8 text-blue">
						{props.widget.value}
					</Typography>
				</div>
			</div>
		</Card>
	);
}

export default React.memo(Widget1);
