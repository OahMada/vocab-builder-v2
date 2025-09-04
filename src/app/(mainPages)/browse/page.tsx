import { Metadata } from 'next';
import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';
import SentenceListingPreparing from '@/components/SentenceListingPreparing';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { InnerWrapper } from './StyledComponents';
import SearchParamsProvider from '@/components/SearchParamsProvider';

export var metadata: Metadata = {
	title: 'Browse | Vocab Builder',
};

export default function SentenceBrowse() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<SearchParamsProvider>
					<InnerWrapper>
						<Breadcrumb />
						<Search />
					</InnerWrapper>
					<SentenceListingPreparing />
				</SearchParamsProvider>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
