import { Metadata } from 'next';
import * as React from 'react';
import { redirect, notFound } from 'next/navigation';

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
import AudioDataProvider from '@/components/AudioDataProvider';
import { ToastProvider, ToastViewport } from '@/components/Toast';
import Spacer from '@/components/Spacer';
import readOneSentence from '@/app/actions/sentence/readOneSentence';
import { SentenceDataType } from '@/lib';
import { constructSentencePiecesData } from '@/helpers';

export var metadata: Metadata = {
	title: 'Sentence | Vocab Builder',
};

type ClientSentenceData = (Omit<SentenceDataType, 'audioBlob'> & { audioUrl: string; id: string }) | null;

export default async function Sentence({ params }: { params: Promise<{ sentenceId: string }> }) {
	let { sentenceId } = await params;

	let sentence: string | undefined = undefined;
	let sentenceData: ClientSentenceData = null;
	if (sentenceId === 'new') {
		let data = await getCookie('sentence');
		if (!data) {
			redirect('/');
		}
		sentence = data;
	} else {
		let result = await readOneSentence(sentenceId);
		if ('error' in result) {
			throw result.error;
		} else if (!result.data) {
			notFound();
		}
		// convert null to undefined to better suit client code
		let clientWordsData = constructSentencePiecesData(result.data.sentence, result.data.pieces);
		sentenceData = {
			...result.data,
			note: result.data.note ?? undefined,
			pieces: clientWordsData,
		};
	}

	return (
		<MaxWidthWrapper>
			<WordsProvider newSentence={sentence ?? undefined} databaseWords={sentenceData?.pieces}>
				<TranslationProvider databaseTranslation={sentenceData?.translation}>
					<NoteProvider databaseNote={sentenceData?.note}>
						<Wrapper $position='flex-start'>
							<Spacer size={0} />
							<CardWrapper>
								<WordListing title={<Title>The Sentence</Title>} />
							</CardWrapper>
							<CardWrapper>
								<Translation title={<Title>Translation</Title>} sentence={(sentenceData?.sentence || sentence) as string} />
							</CardWrapper>
							<Note title={<Title>Note</Title>} />
							<AudioDataProvider audioUrl={sentenceData?.audioUrl}>
								<ToastProvider>
									<ToastViewport $position='top' />
									<SentenceActions sentence={(sentenceData?.sentence || sentence) as string} sentenceId={sentenceData?.id} />
								</ToastProvider>
							</AudioDataProvider>
							<Spacer size={0} />
						</Wrapper>
					</NoteProvider>
				</TranslationProvider>
			</WordsProvider>
		</MaxWidthWrapper>
	);
}
