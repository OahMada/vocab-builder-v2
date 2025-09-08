import { Metadata } from 'next';
import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

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
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				{children}
				{search}
				{browse}
			</Wrapper>
		</MaxWidthWrapper>
	);
}
