import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import WordListing from '@/components/WordListing';
import Translation from '@/components/Translation';
import Note from '@/components/Note';
import SentenceActions from '@/components/SentenceActions';
import Title from './Title';
import CardWrapper from './CardWrapper';

export default function Sentence() {
	return (
		<Wrapper $position='flex-start'>
			<CardWrapper>
				<WordListing title={<Title>Your Sentence</Title>} />
			</CardWrapper>
			<CardWrapper>
				<Translation title={<Title>Translation</Title>} />
			</CardWrapper>
			<Note title={<Title>Note</Title>} />
			<SentenceActions />
		</Wrapper>
	);
}
