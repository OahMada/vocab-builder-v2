'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import { TOAST_ID } from '@/constants';
import { constructSentence, constructSentencePiecesData, markSearchMatchesInSentencePieces } from '@/helpers';
import { SentenceWithPieces } from '@/lib';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import PlayAudioFromUrl from '@/components/PlayAudioFromUrl';
import deleteSentence from '@/app/actions/sentence/deleteSentence';
import AlertDialog from '@/components/AlertDialog';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { useSearchParamsContext } from '@/components/SearchParamsProvider';

type SentenceListingEntryProps = {
	index: number;
	onDeleteSentence: (id: string) => void;
	playAudio: (audioUrl: string, sentenceId: string) => Promise<void>;
	stopAudio: () => void;
	isPlaying: boolean;
	isLoading: boolean;
} & Omit<SentenceWithPieces, 'audioHash'> &
	React.ComponentProps<'div'>;

function SentenceListingEntry({
	id,
	index,
	translation,
	note,
	sentence,
	audioUrl,
	pieces,
	onDeleteSentence,
	playAudio,
	stopAudio,
	isPlaying,
	isLoading,
	...delegated
}: SentenceListingEntryProps) {
	let { search } = useSearchParamsContext();
	let { addToToast } = useGlobalToastContext();
	// merge database pieces data with other sentence parts
	let sentencePieces = constructSentencePiecesData(sentence, pieces);

	let finalPieces: React.ReactNode[] = [];
	if (search) {
		// mark search queries in pieces data
		let sentenceMarkedPieces = markSearchMatchesInSentencePieces(sentencePieces, search);
		// construct the whole sentence
		finalPieces = constructSentence(sentenceMarkedPieces);
	} else {
		finalPieces = constructSentence(sentencePieces);
	}

	// let { isPlaying, playAudio, stopAudio, isAudioLoading } = usePlayAudio();
	let router = useRouter();

	async function handleDeleteAction() {
		// not wrapped in startTransition because I need this function to be an async one
		let result = await deleteSentence({ sentenceId: id, audioUrl });
		if ('error' in result) {
			addToToast({
				id: TOAST_ID.SENTENCE_DELETION,
				contentType: 'error',
				content: result.error,
			});
			return;
		}
		onDeleteSentence(id);
	}

	return (
		<AccordionItem id={id} {...delegated}>
			<AccordionTrigger>
				<SentenceWrapper>
					<Index>{`${index + 1}. `}</Index>
					{finalPieces}
					<AudioButton
						style={{ '--icon-size': '16px', '--line-height': '1.6', '--font-size': '1.1rem' } as React.CSSProperties}
						isPlaying={isPlaying}
						playAudio={() => playAudio(audioUrl, id)}
						stopAudio={stopAudio}
						isLoading={isLoading}
					/>
				</SentenceWrapper>
			</AccordionTrigger>
			<AccordionContent asChild={true}>
				<ContentWrapper>
					<InnerWrapper>
						{note && <Title>Translation:</Title>}
						<Translation>{translation}</Translation>
					</InnerWrapper>
					{note && (
						<InnerWrapper>
							<NoteTitle>Note:</NoteTitle>
							<Note>{note}</Note>
						</InnerWrapper>
					)}
					<ActionWrapper>
						<AlertDialog description='This action cannot be undone.' handleAction={handleDeleteAction}>
							<Button
								variant='fill'
								style={{ '--text-color': 'var(--text-status-warning)' } as React.CSSProperties}
								onClick={() => {
									stopAudio();
								}}
							>
								<Icon id='delete' />
								&nbsp;Delete
							</Button>
						</AlertDialog>
						<Button
							variant='fill'
							onClick={() => {
								stopAudio();
								router.push(`/sentence/${id}`);
							}}
						>
							<EditIcon id='edit' />
							&nbsp;Edit
						</Button>
					</ActionWrapper>
				</ContentWrapper>
			</AccordionContent>
		</AccordionItem>
	);
}

export default SentenceListingEntry;

var SentenceWrapper = styled.p`
	font-size: 1.1rem;
	line-height: 1.6;
`;

var AudioButton = styled(PlayAudioFromUrl)`
	display: inline-block;
	--hover-bg-color: var(--bg-tertiary);
	margin-left: 8px;
	vertical-align: -2.5px;
	/* to make sure the icon has the same height as the text */
	padding: calc((var(--line-height) * var(--font-size) - var(--icon-size)) / 2);
	padding: 4px;
`;

var ContentWrapper = styled.div`
	padding: var(--overall-padding);
	background-color: var(--bg-secondary);
	border-bottom-left-radius: var(--border-radius);
	border-bottom-right-radius: var(--border-radius);
	color: var(--text-secondary);
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

var InnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
`;

var Translation = styled.p``;

var Note = styled.p`
	background-color: var(--bg-tertiary);
	padding: 5px 8px;
	border-radius: 8px;
	white-space: pre-wrap;
`;

var Title = styled.h4`
	font-weight: 500;
`;

var NoteTitle = styled(Title)``;

var ActionWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 8px;
`;

var EditIcon = styled(Icon)`
	/* optical alignment */
	position: relative;
	top: -1px;
`;

var Index = styled.span`
	font-size: 1rem;
	font-weight: 300;
	pointer-events: none;
`;
