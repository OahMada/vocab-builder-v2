import { Metadata } from 'next';
import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';
import SentenceListing from '@/components/SentenceListing';
import InnerWrapper from './InnerWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export var metadata: Metadata = {
	title: 'Browse | Vocab Builder',
};

export default function SentenceBrowse() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<InnerWrapper>
					<Breadcrumb />
					<Search />
				</InnerWrapper>
				<SentenceListing />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
