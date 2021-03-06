import FuseAnimate from '@fuse/core/FuseAnimate';
import { useDeepCompareEffect } from '@fuse/hooks';
import { Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import * as Actions from './store/actions';

function WalletHeader(props) {
	const dispatch = useDispatch();
	const walletBalance = useSelector(({ wallet }) => wallet.wallet.walletBalance);
	const walletCurrency = useSelector(({ wallet }) => wallet.wallet.walletCurrency);
	// const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);
	const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);

	const routeParams = useParams();

	// useDeepCompareEffect(() => {
	// 	dispatch(Actions.getWalletBalance(routeParams));
	// }, [dispatch, routeParams]);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			{/* <div className="flex items-center">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="text-32">shopping_basket</Icon>
				</FuseAnimate>

				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
						Wallet Balance: {walletBalance} {walletCurrency}
					</Typography>
				</FuseAnimate>
			</div> */}

		
			{/* <div className="flex flex-1 items-center justify-center px-12">
				<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
						<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
							<Icon color="action">search</Icon>

							<Input
								placeholder="Search"
								className="flex flex-1 mx-8"
								disableUnderline
								fullWidth
								value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={ev => dispatch(Actions.setOrdersSearchText(ev))}
							/>
						</Paper>
					</FuseAnimate>
				</ThemeProvider>
			</div> */}
			
		</div>
	);
}

export default WalletHeader;
