'use client';

import * as React from 'react';
import styled from 'styled-components';

import Word from '@/components/Word';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';

function WordListing({ title, sentence }: { title: React.ReactNode; sentence: string }) {
	let { pieces } = useSentencePiecesContext();

	return (
		<>
			<TitleWrapper>
				{title}
				<Popover>
					<PopoverTrigger asChild={true}>
						<InfoButton variant='icon'>
							<Icon id='info' size={14} />
							<VisuallyHidden>Notice</VisuallyHidden>
						</InfoButton>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>Tap or click on the word to load its IPA. Tap or click on the IPA to dismiss it.</DescriptionText>
					</PopoverContent>
				</Popover>
			</TitleWrapper>
			<WordWrapper>
				{pieces.map((item) => {
					if (typeof item === 'string') {
						return item;
					}
					return <Word key={item.id} piece={item.word} IPA={item.IPA ? item.IPA : undefined} id={item.id} sentence={sentence} />;
				})}
			</WordWrapper>
		</>
	);
}

export default WordListing;

var TitleWrapper = styled.div`
	display: flex;
	gap: 5px;
	align-items: baseline;
`;

var WordWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 5px;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
