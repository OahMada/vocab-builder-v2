import * as React from 'react';
import Icon from '@/components/Icon';
import { ViewAllButton, Wrapper, InnerWrapper, SmallTitle, ErrorText } from './StyledComponents';
import readLatestSentence from '@/app/actions/sentence/readLatestSentence';
import { CompactSentenceListingEntry } from '@/components/SentenceListingEntry';

// TODO view all button only shows up when there's at least two

async function LatestSentence() {
	let result = await readLatestSentence();

	if ('error' in result) {
		return (
			<Wrapper>
				<ErrorText>{result.error}</ErrorText>
			</Wrapper>
		);
	}

	let latestSentence = result?.data;
	if (!latestSentence) {
		return;
	}

	let { pieces, audioUrl, sentence } = latestSentence;

	return (
		<Wrapper>
			<InnerWrapper>
				<SmallTitle>Latest Sentence</SmallTitle>
				<CompactSentenceListingEntry pieces={pieces} audioUrl={audioUrl} sentence={sentence} />
			</InnerWrapper>
			<ViewAllButton variant='outline' href='/browse'>
				<Icon id='forward' />
				&nbsp;View All
			</ViewAllButton>
		</Wrapper>
	);
}

export default LatestSentence;
