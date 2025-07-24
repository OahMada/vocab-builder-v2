'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent } from '@/components/AlertDialog';

interface SentenceListingEntryProps {
	id: string;
	index: number;
	translation: string;
	sentence: React.ReactNode;
	note?: string;
}

function SentenceListingEntry({ id, index, translation, note, sentence }: SentenceListingEntryProps) {
	return (
		<AccordionItem id={id}>
			<AccordionTrigger index={index}>
				<SentenceWrapper>
					{sentence}
					<AudioButton variant='icon' style={{ '--icon-size': '16px' } as React.CSSProperties}>
						<Icon id='audio' size={16} />
						<VisuallyHidden>play sentence audio</VisuallyHidden>
					</AudioButton>
				</SentenceWrapper>
			</AccordionTrigger>
			<AccordionContent asChild={true}>
				<ContentWrapper>
					<InnerWrapper>
						<Title>Translation</Title>
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
						<Button variant='fill'>
							<Icon id='edit' />
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
`;

var AudioButton = styled(Button)`
	display: inline-block;
	--hover-bg-color: var(--bg-tertiary);
	margin-left: 8px;
	vertical-align: -2.5px;
	vertical-align: -3px;
	/* to make sure the icon has the same height as the text */
	padding: calc((1.5 * 16px - var(--icon-size)) / 2);
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
