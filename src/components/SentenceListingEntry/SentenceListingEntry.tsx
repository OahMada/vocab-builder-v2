'use client';

import * as React from 'react';
import styled from 'styled-components';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

interface SentenceListingEntryProps {
	id: string;
	index: number;
	translation: string;
	sentence: string;
	note?: string;
}

function SentenceListingEntry({ id, index, translation, note, sentence }: SentenceListingEntryProps) {
	return (
		<AccordionItem id={id}>
			<AccordionTrigger index={index}>
				<p>{sentence}</p>
			</AccordionTrigger>
			<AccordionContent asChild={true}>
				<ContentWrapper>
					<InnerWrapper>
						<Title>Translation</Title>
						<p>{translation} </p>
					</InnerWrapper>
					{note && (
						<InnerWrapper>
							<NoteTitle>Note</NoteTitle>
							<Note>{note}</Note>
						</InnerWrapper>
					)}
					<ActionWrapper>
						<Button variant='fill'>
							<Icon id='delete' />
							&nbsp;Delete
						</Button>
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

var ContentWrapper = styled.div`
	padding: 12px;
	background-color: var(--bg-secondary);
	border-bottom-left-radius: 12px;
	border-bottom-right-radius: 12px;
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
