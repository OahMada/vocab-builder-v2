import { Metadata } from 'next';
import * as React from 'react';

import Wrapper from '@/components/PageWrapper';
import WordListing from '@/components/WordListing';
import Translation from '@/components/Translation';
import Note from '@/components/Note';
import SentenceActions from '@/components/SentenceActions';
import Title from './Title';
import CardWrapper from './CardWrapper';
import Spacer from '@/components/Spacer';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getCookie } from '@/helpers/getCookie';
import NoteTextProvider from '@/components/NoteTextProvider';
import TranslationTextProvider from '@/components/TranslationTextProvider';
import WordsIPAProvider from '@/components/WordsIPAProvider';

export var metadata: Metadata = {
	title: 'Sentence | Vocab Builder',
};

// TODO clear 'user-input' local storage when leaving this page

export default async function Sentence({ params }: { params: Promise<{ sentenceId: string }> }) {
	let { sentenceId } = await params;

	let sentence: string = '';
	if (sentenceId === 'new') {
		let data = await getCookie('user-input');
		if (!data) {
			// TODO need an error boundary? error.tsx in route segment
			throw new Error('Could not access user-inputted sentence.');
		}
		sentence = data;
	} else {
		// TODO get sentence from database
	}

	return (
		<WordsIPAProvider newSentence={sentence}>
			<TranslationTextProvider>
				<NoteTextProvider>
					<MaxWidthWrapper>
						<Wrapper $position='flex-start'>
							<CardWrapper>
								<WordListing title={<Title>Your Sentence</Title>} />
							</CardWrapper>
							<CardWrapper>
								<Translation title={<Title>Translation</Title>} sentence={sentence} />
							</CardWrapper>
							<Note title={<Title>Note</Title>} />
							<Spacer size={1} />
							<SentenceActions />
						</Wrapper>
					</MaxWidthWrapper>
				</NoteTextProvider>
			</TranslationTextProvider>
		</WordsIPAProvider>
	);
}
