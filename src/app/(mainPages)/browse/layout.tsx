import { Metadata } from 'next';
import * as React from 'react';
import { connection } from 'next/server';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import SearchParamsProvider from '@/components/SearchParamsProvider';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';

export var metadata: Metadata = {
	title: 'Browse | Vocab Builder',
};

export default async function SentenceBrowse({
	search,
	browse,
	children,
}: {
	search: React.ReactNode;
	browse: React.ReactNode;
	children: React.ReactNode;
}) {
	let session = await auth();
	if (!session?.user) {
		return (
			<MaxWidthWrapper>
				<UnauthorizedDisplay />
			</MaxWidthWrapper>
		);
	}

	// to avoid build error: useSearchParams() should be wrapped in a suspense boundary https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout#possible-ways-to-fix-it
	await connection();
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<SearchParamsProvider>
					{children}
					{search}
					{browse}
				</SearchParamsProvider>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
