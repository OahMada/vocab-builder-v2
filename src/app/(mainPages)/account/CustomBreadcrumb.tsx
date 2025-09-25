'use client';

import styled from 'styled-components';

import { Breadcrumbs, Crumb } from '@/components/Breadcrumbs';

var CustomBreadcrumbs = styled(Breadcrumbs)`
	align-self: flex-start;
	/* for optical alignment */
	margin-left: 5px;
`;

function Breadcrumb() {
	return (
		<CustomBreadcrumbs>
			<Crumb href='/'>Home</Crumb>
			<Crumb href='/account' isCurrentPage={true}>
				Account
			</Crumb>
		</CustomBreadcrumbs>
	);
}

export default Breadcrumb;
