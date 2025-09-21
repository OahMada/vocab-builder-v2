import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { ChildrenWrapper } from './StyledComponents';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';

export default async function Page() {
	let session = await auth();
	if (!session?.user) {
		return null;
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/');
	}

	return (
		<ChildrenWrapper>
			<Breadcrumb />
			{/* https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout nuqs's useQueryState mush internally uses useSearchParams */}
			<Search />
		</ChildrenWrapper>
	);
}
