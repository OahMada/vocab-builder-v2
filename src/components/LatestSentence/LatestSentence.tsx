import * as React from 'react';
import { unstable_cache } from 'next/cache';
import Icon from '@/components/Icon';
import { ViewAllButton, InnerWrapper, SmallTitle, ErrorText, Sentence, Wrapper } from './StyledComponents';
import readLatestSentence from '@/app/actions/sentence/readLatestSentence';

var getCachedSentence = unstable_cache(
	async () => {
		return await readLatestSentence();
	},
	[],
	{ revalidate: 3600, tags: ['latest'] }
);

async function LatestSentence() {
	let result = await getCachedSentence();

	if ('error' in result) {
		return (
			<InnerWrapper>
				<ErrorText>{result.error}</ErrorText>
			</InnerWrapper>
		);
	}

	let latestSentence = result.data;
	if (!latestSentence) {
		return;
	}

	let { sentence } = latestSentence;

	return (
		<Wrapper>
			<InnerWrapper>
				<SmallTitle>Latest</SmallTitle>
				<Sentence>{sentence}</Sentence>
			</InnerWrapper>
			<ViewAllButton variant='fill' href='/browse'>
				<Icon id='forward' size={14} />
				&nbsp;Browse
			</ViewAllButton>
		</Wrapper>
	);
}

export default LatestSentence;
