'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { SentenceWithPieces } from '@/lib/sentenceReadSelect';
import PlayAudioFromUrl from '@/components/PlayAudioFromUrl';
import { useConstructedSentence } from '@/hooks';
import deleteSentence from '@/app/actions/sentence/deleteSentence';
import AlertDialog from '@/components/AlertDialog';
import Toast from '@/components/Toast';

type SentenceListingEntryProps = {
	index: number;
} & SentenceWithPieces;

function SentenceListingEntry({ id, index, translation, note, sentence, audioUrl, pieces }: SentenceListingEntryProps) {
	let sentencePieces = useConstructedSentence(sentence, pieces);
	let [isLoading, setIsLoading] = React.useState(false);
	let [errorMsg, setErrorMsg] = React.useState('');

	async function handleDeleteAction() {
		setIsLoading(true);
		let result = await deleteSentence(id);
		if ('error' in result) {
			setErrorMsg(result.error);
		}
		setIsLoading(false);
	}
	return (
		<>
			<AccordionItem id={id}>
				<AccordionTrigger>
					<SentenceWrapper>
						<Index>{`${index + 1}.`}</Index>&nbsp;
						{sentencePieces}
						<AudioButton
							style={{ '--icon-size': '16px', '--line-height': '1.6', '--font-size': '1.1rem' } as React.CSSProperties}
							audioUrl={audioUrl}
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
								<Button variant='fill' style={{ '--text-color': 'var(--text-status-warning)' } as React.CSSProperties}>
									<Icon id='delete' />
									&nbsp;Delete
								</Button>
							</AlertDialog>
							<Button variant='fill' href='/sentence/id' disabled={isLoading}>
								<EditIcon id='edit' />
								&nbsp;Edit
							</Button>
						</ActionWrapper>
					</ContentWrapper>
				</AccordionContent>
			</AccordionItem>
			{errorMsg && <Toast content={errorMsg} />}
		</>
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

var Translation = styled.p`
	font-style: italic;
`;

var Note = styled.p`
	white-space: pre-line;
	background-color: var(--bg-tertiary);
	padding: 5px 8px;
	border-radius: 8px;
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
