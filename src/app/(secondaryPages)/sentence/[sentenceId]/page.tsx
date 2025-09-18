import { Metadata } from 'next';
import * as React from 'react';
import { redirect, notFound } from 'next/navigation';

import readOneSentenceById from '@/app/actions/sentence/readOneSentenceById';

import { COOKIE_KEY } from '@/constants';
import { constructSentencePiecesData } from '@/helpers';
import { SentenceCreateInputType } from '@/lib';
import getCookie from '@/lib/getCookie';
import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import WordListing from '@/components/WordListing';
import Translation from '@/components/Translation';
import Note from '@/components/Note';
import SentenceActions from '@/components/SentenceActions';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import NoteProvider from '@/components/NoteProvider';
import TranslationProvider from '@/components/TranslationProvider';
import SentencePiecesProvider from '@/components/SentencePiecesProvider';
import AudioDataProvider from '@/components/AudioDataProvider';
import { ToastProvider, ToastViewport } from '@/components/Toast';
import Spacer from '@/components/Spacer';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import Title from './Title';
import CardWrapper from './CardWrapper';

export var metadata: Metadata = {
	title: 'Sentence | Vocab Builder',
};

type ClientSentenceData = (Omit<SentenceCreateInputType, 'audioBlob'> & { audioUrl: string; id: string }) | null;

export default async function Sentence({ params }: { params: Promise<{ sentenceId: string }> }) {
	let { sentenceId } = await params;
	let session = await auth();
	if (!session?.user) {
		return (
			<MaxWidthWrapper>
				<UnauthorizedDisplay callback={`/sentence/${sentenceId}`} />
			</MaxWidthWrapper>
		);
	}
	let userId = session.user.id;

	let sentence: string | undefined = undefined;
	let sentenceData: ClientSentenceData = null;
	if (sentenceId === 'new') {
		let data = await getCookie(COOKIE_KEY);
		if (!data) {
			redirect('/');
		}
		sentence = data;
	} else {
		let result = await readOneSentenceById({ sentenceId, userId });
		if ('error' in result) {
			throw result.error;
		} else if (!result.data) {
			notFound();
		}
		// convert null to undefined to better suit client code
		let sentencePiecesData = constructSentencePiecesData(result.data.sentence, result.data.pieces);
		sentenceData = {
			...result.data,
			note: result.data.note ?? undefined,
			pieces: sentencePiecesData,
		};
	}

	return (
		<MaxWidthWrapper>
			<SentencePiecesProvider newSentence={sentence} databasePieces={sentenceData?.pieces}>
				<TranslationProvider databaseTranslation={sentenceData?.translation}>
					<NoteProvider databaseNote={sentenceData?.note}>
						<Wrapper $position='flex-start'>
							<Spacer size={0} />
							<CardWrapper>
								<WordListing title={<Title>The Sentence</Title>} sentence={(sentenceData?.sentence || sentence) as string} />
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
			</SentencePiecesProvider>
		</MaxWidthWrapper>
	);
}
