import { Metadata } from 'next';
import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import Search from '@/components/SearchSentence';
import SentenceListing from '@/components/SentenceListing';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { NoticeText, InnerWrapper } from './StyledComponents';

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
					<NoticeText>Tap or click on the underlined words to reveal its IPA.</NoticeText>
				</InnerWrapper>
				<SentenceListing />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
