import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';
import SentenceListing from '@/components/SentenceListing';

export default function SentenceBrowse() {
	return (
		<Wrapper $position='flex-start'>
			<Breadcrumb />
			<Search />
			<SentenceListing />
		</Wrapper>
	);
}
