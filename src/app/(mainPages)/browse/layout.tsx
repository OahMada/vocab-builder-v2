import { Metadata } from 'next';
import * as React from 'react';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import SearchParamsProvider from '@/components/SearchParamsProvider';

export var metadata: Metadata = {
	title: 'Browse | Vocab Builder',
};

export default function SentenceBrowse({
	search,
	browse,
	children,
}: {
	search: React.ReactNode;
	browse: React.ReactNode;
	children: React.ReactNode;
}) {
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
