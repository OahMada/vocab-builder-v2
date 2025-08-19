import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import Wrapper from '@/components/PageWrapper';
import WordListing from '@/components/WordListing';
import Translation from '@/components/Translation';
import Note from '@/components/Note';
import SentenceActions from '@/components/SentenceActions';
import Title from './Title';
import CardWrapper from './CardWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getCookie } from '@/helpers/getCookie';
import NoteTextProvider from '@/components/NoteTextProvider';
import TranslationTextProvider from '@/components/TranslationTextProvider';
import WordsIPAProvider from '@/components/WordsIPAProvider';
import SentenceAudioProvider from '@/components/SentenceAudioProvider';
import { ToastProvider, ToastViewport } from '@/components/Toast';
import Spacer from '@/components/Spacer';

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
			redirect('/');
		}
		sentence = data;
	} else {
		// TODO get sentence from database
	}

	return (
		<MaxWidthWrapper>
			<WordsIPAProvider newSentence={sentence}>
				<TranslationTextProvider>
					<NoteTextProvider>
						<Wrapper $position='flex-start'>
							<Spacer size={0} />
							<CardWrapper>
								<WordListing title={<Title>Your Sentence</Title>} />
							</CardWrapper>
							<CardWrapper>
								<Translation title={<Title>Translation</Title>} sentence={sentence} />
							</CardWrapper>
							<Note title={<Title>Note</Title>} />
							<SentenceAudioProvider>
								<ToastProvider>
									<ToastViewport $position='top' />
									<SentenceActions />
								</ToastProvider>
							</SentenceAudioProvider>
							<Spacer size={0} />
						</Wrapper>
					</NoteTextProvider>
				</TranslationTextProvider>
			</WordsIPAProvider>
		</MaxWidthWrapper>
	);
}
