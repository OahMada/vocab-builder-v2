import * as React from 'react';

import { ChildrenWrapper } from './StyledComponents';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';

export default function Page() {
	return (
		<ChildrenWrapper>
			<Breadcrumb />
			<Search />
		</ChildrenWrapper>
	);
}
