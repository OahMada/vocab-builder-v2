import { Metadata } from 'next';
import * as React from 'react';
import { redirect, notFound } from 'next/navigation';

import readOneSentenceById from '@/app/actions/sentence/readOneSentenceById';

import { COOKIE_KEY } from '@/constants';
import { SentenceWithPieces } from '@/lib';
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
import Spacer from '@/components/Spacer';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import CardWrapper from '@/components/CardWrapper';
import Title from './Title';

export var metadata: Metadata = {
	title: 'Sentence | Vocab Builder',
};

export default async function Sentence({ params }: { params: Promise<{ sentenceId: string }> }) {
	let { sentenceId } = await params;
	let session = await auth();
	if (!session?.user) {
		return (
			<MaxWidthWrapper>
				<UnauthorizedDisplay callback={`/sentence/${sentenceId}`} />
			</MaxWidthWrapper>
		);
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/');
	}
	let userId = session.user.id;

	let sentence: string | undefined = undefined;
	let sentenceData: SentenceWithPieces | undefined = undefined;
	if (sentenceId === 'new') {
		let data = await getCookie(COOKIE_KEY);
		if (!data) {
			redirect('/');
		}
		sentence = data;
	} else {
		let result = await readOneSentenceById({ sentenceId, userId });
		if ('error' in result) {
			throw new Error(result.error);
		} else if (!result.data) {
			notFound();
		}

		sentenceData = result.data;
	}

	return (
		<MaxWidthWrapper>
			<SentencePiecesProvider sentence={(sentence || sentenceData?.sentence) as string} databasePieces={sentenceData?.pieces}>
				<TranslationProvider databaseTranslation={sentenceData?.translation}>
					<NoteProvider databaseNote={sentenceData?.note || undefined}>
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
								<SentenceActions sentence={(sentenceData?.sentence || sentence) as string} sentenceId={sentenceData?.id} />
							</AudioDataProvider>
							<Spacer size={16} />
						</Wrapper>
					</NoteProvider>
				</TranslationProvider>
			</SentencePiecesProvider>
		</MaxWidthWrapper>
	);
}
