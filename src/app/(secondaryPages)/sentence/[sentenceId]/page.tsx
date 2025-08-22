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
import NoteProvider from '@/components/NoteProvider';
import TranslationProvider from '@/components/TranslationProvider';
import WordsProvider from '@/components/WordsProvider';
import AudioBlobProvider from '@/components/AudioBlobProvider';
import { ToastProvider, ToastViewport } from '@/components/Toast';
import Spacer from '@/components/Spacer';

export var metadata: Metadata = {
	title: 'Sentence | Vocab Builder',
};

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
			<WordsProvider newSentence={sentence}>
				<TranslationProvider>
					<NoteProvider>
						<Wrapper $position='flex-start'>
							<Spacer size={0} />
							<CardWrapper>
								<WordListing title={<Title>Your Sentence</Title>} />
							</CardWrapper>
							<CardWrapper>
								<Translation title={<Title>Translation</Title>} sentence={sentence} />
							</CardWrapper>
							<Note title={<Title>Note</Title>} />
							<AudioBlobProvider>
								<ToastProvider>
									<ToastViewport $position='top' />
									<SentenceActions sentence={sentence} />
								</ToastProvider>
							</AudioBlobProvider>
							<Spacer size={0} />
						</Wrapper>
					</NoteProvider>
				</TranslationProvider>
			</WordsProvider>
		</MaxWidthWrapper>
	);
}
