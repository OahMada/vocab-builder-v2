import * as React from 'react';

import { ChildrenWrapper } from './StyledComponents';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';

export default function Page() {
	return (
		<ChildrenWrapper>
			<Breadcrumb />
			{/* https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout nuqs's useQueryState mush internally uses useSearchParams */}
			<Search />
		</ChildrenWrapper>
	);
}
