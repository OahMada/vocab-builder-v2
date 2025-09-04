'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { SentenceWithPieces } from '@/lib/sentenceReadSelect';
import PlayAudioFromUrl from '@/components/PlayAudioFromUrl';
import { usePlayAudio } from '@/hooks';
import deleteSentence from '@/app/actions/sentence/deleteSentence';
import AlertDialog from '@/components/AlertDialog';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID } from '@/constants';
import { constructSentence } from '@/helpers';

type SentenceListingEntryProps = {
	index: number;
	onDeleteSentence: (id: string) => void;
} & SentenceWithPieces &
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
	...delegated
}: SentenceListingEntryProps) {
	let { addToToast, removeFromToast } = useGlobalToastContext();
	let sentencePieces = constructSentence(sentence, pieces);
	let [isLoading, setIsLoading] = React.useState(false);
	let { isPlaying, playAudio, stopAudio } = usePlayAudio(audioUrl);

	async function handleDeleteAction() {
		setIsLoading(true);
		removeFromToast(TOAST_ID.SENTENCE_DELETION);
		// not wrapped in startTransition because I need this function to be an async one
		let result = await deleteSentence(id);
		if ('error' in result) {
			setIsLoading(false);
			addToToast({
				id: TOAST_ID.SENTENCE_DELETION,
				contentType: 'error',
				content: result.error,
			});
			return;
		}
		onDeleteSentence(id);
		setIsLoading(false);
	}

	return (
		<AccordionItem id={id} {...delegated}>
			<AccordionTrigger>
				<SentenceWrapper>
					<Index>{`${index + 1}. `}</Index>
					{sentencePieces}
					<AudioButton
						style={{ '--icon-size': '16px', '--line-height': '1.6', '--font-size': '1.1rem' } as React.CSSProperties}
						isPlaying={isPlaying}
						playAudio={playAudio}
						stopAudio={stopAudio}
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
						<AlertDialog description='This action cannot be undone.' handleDeleteAction={handleDeleteAction} isDeleting={isLoading}>
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
							href={`/sentence/${id}`}
							disabled={isLoading}
							onClick={() => {
								stopAudio();
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
