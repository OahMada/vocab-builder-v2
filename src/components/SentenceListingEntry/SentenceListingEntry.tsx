'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent } from '@/components/AlertDialog';
import WordWithPhoneticSymbol from '@/components/WordWithPhoneticSymbol';
import { SentenceWithPieces } from '../SentenceListing/sentenceSelect';
import PlayAudioFromUrl from '@/components/PlayAudioFromUrl';

type SentenceListingEntryProps = {
	index: number;
} & SentenceWithPieces;

function SentenceListingEntry({ id, index, translation, note, sentence, audioUrl, pieces }: SentenceListingEntryProps) {
	let sentencePieces = pieces.map(({ IPA, isWord, piece, id }) => {
		if (!isWord) {
			return piece;
		} else {
			if (!IPA) {
				return piece;
			} else {
				return (
					<WordWithPhoneticSymbol symbol={IPA} key={id}>
						{piece}
					</WordWithPhoneticSymbol>
				);
			}
		}
	});

	return (
		<AccordionItem id={id}>
			<AccordionTrigger index={index}>
				<SentenceWrapper>
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
						{note && <Title>Translation</Title>}
						<p>{translation}</p>
					</InnerWrapper>
					{note && (
						<InnerWrapper>
							<NoteTitle>Note</NoteTitle>
							<Note>{note}</Note>
						</InnerWrapper>
					)}
					<ActionWrapper>
						<AlertDialog>
							<AlertDialogTrigger asChild={true}>
								<Button variant='fill' style={{ '--text-color': 'var(--text-status-warning)' } as React.CSSProperties}>
									<Icon id='delete' />
									&nbsp;Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent description='This action cannot be undone.' />
						</AlertDialog>
						<Button variant='fill' href='/sentence/id'>
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
	padding: var(--overall-padding) 14px;
	background-color: var(--bg-secondary);
	border-bottom-left-radius: var(--border-radius);
	border-bottom-right-radius: var(--border-radius);
	color: var(--text-secondary);
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

var InnerWrapper = styled.div``;

var Note = styled.p`
	font-style: italic;
`;

var Title = styled.h4`
	font-weight: 500;
`;

var NoteTitle = styled(Title)`
	font-style: italic;
`;

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
