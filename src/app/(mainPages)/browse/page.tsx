import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Search from '@/components/SearchSentence';
import { ChildrenWrapper } from './StyledComponents';
import Breadcrumb from '@/components/CustomBreadcrumb';

export default async function Page() {
	let session = await auth();
	if (!session?.user) {
		return null;
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/');
	}

	return (
		<ChildrenWrapper>
			<Breadcrumb page='Browse' link='/browse' />
			<Search />
		</ChildrenWrapper>
	);
}
