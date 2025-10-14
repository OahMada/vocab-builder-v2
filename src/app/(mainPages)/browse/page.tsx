import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Search from '@/components/SearchSentence';
import { ChildrenWrapper } from './StyledComponents';
import Breadcrumb from '@/components/CustomBreadcrumb';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default async function Page() {
	let session = await auth();
	if (!session?.user) {
		return null;
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/');
	}

	return (
		<ChildrenWrapper>
			<MaxWidthWrapper>
				<Breadcrumb page='Browse' link='/browse' />
				{/* https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout nuqs's useQueryState mush internally uses useSearchParams */}
				<Search />
			</MaxWidthWrapper>
		</ChildrenWrapper>
	);
}
