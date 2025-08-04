'use client';

import * as React from 'react';
import styled from 'styled-components';
import Word from '@/components/Word';
import { segmentSentence } from '@/helpers';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';

function WordListing({ title, sentence }: { title: React.ReactNode; sentence: string }) {
	let segmentedSentence = segmentSentence(sentence);
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
				{segmentedSentence.map((item) => {
					return <Word key={item.id} segment={item.segment} isWord={item.isWordLike} />;
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

	/* optical alignment */
	transform: translateY(1px);
`;
