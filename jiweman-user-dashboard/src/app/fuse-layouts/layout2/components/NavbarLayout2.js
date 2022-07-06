import Logo from 'app/fuse-layouts/shared-components/Logo';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import React from 'react';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';

function NavbarLayout2() {
	return (
		<div className="flex flex-auto justify-between items-center w-full h-full container p-0 lg:pl-8">
			<div className="flex flex-shrink-0 items-center px-8">
				<Logo />
			</div>

			<div className="flex flex-shrink-0 items-center">
				<FuseScrollbars className="flex h-full items-center">
					<Navigation className="w-full" layout="horizontal" />
				</FuseScrollbars>

				<div className="flex">
					<UserMenu />
				</div>
			</div>

		</div>
	);
}

export default React.memo(NavbarLayout2);
