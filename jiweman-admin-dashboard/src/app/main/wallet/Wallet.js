import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React from 'react';
import reducer from './store/reducers/';
import WalletHeader from './WalletHeader';
import WalletTable from './WalletTable';

function Wallet() {
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<WalletHeader />}
			content={<WalletTable />}
			innerScroll
		/>
	);
}

export default withReducer('wallet', reducer)(Wallet);
