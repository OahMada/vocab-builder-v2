import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import WordListing from '@/components/WordListing';
import Translation from '@/components/Translation';
import Note from '@/components/Note';
import Spacer from '@/components/Spacer';
import SentenceActions from '@/components/SentenceActions';

export default function Sentence() {
	return (
		<Wrapper position='flex-start'>
			<Spacer size={1} />
			<WordListing />
			<Translation />
			<Note />
			<SentenceActions />
		</Wrapper>
	);
}
