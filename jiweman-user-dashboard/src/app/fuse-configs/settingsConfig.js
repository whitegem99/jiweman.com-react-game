const settingsConfig = {
	layout: {
		style: 'layout1', // layout-1 layout-2 layout-3
		config: {
			mode: 'fullwidth',
			scroll: 'content',
			navbar: {
				display: false
			},
			toolbar: {
				display: true,
				position: 'above'
			},
			footer: {
				display: false,
				style: 'fixed'
			},
			leftSidePanel: {
				display: false
			},
			rightSidePanel: {
				display: false
			}
		}
	},
	customScrollbars: false,
	animations: true,
	direction: 'ltr', // rtl, ltr
	theme: {
		main: 'sweetHues',
		navbar: 'sweetHues',
		toolbar: 'sweetHues',
		footer: 'sweetHues'
	}
};

export default settingsConfig;
