import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import React from 'react';
import { useSelector } from 'react-redux';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import VerificationDialog from 'app/fuse-layouts/shared-components/VerificationDialog';

const useStyles = makeStyles(theme => ({
	separator: {
		width: 1,
		height: 64,
		backgroundColor: theme.palette.divider
	}
}));

function ToolbarLayout1(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);

	const classes = useStyles(props);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className="flex relative z-10"
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.default }}
			>
				<Toolbar className="p-0">
					{config.navbar.position === 'left' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-64 h-64 p-0" />
							<div className={classes.separator} />
						</Hidden>
					)}

					{/* Logo */}
					<div className="flex flex-1 px-16">
						<Logo />
					</div>

					<Hidden mdDown>
						<FuseScrollbars className="flex h-full items-center">
							<Navigation className="w-full" layout="horizontal" />
						</FuseScrollbars>
					</Hidden>

					<div className="flex">
						<UserMenu />
						<VerificationDialog></VerificationDialog>
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton />
						</Hidden>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout1);
