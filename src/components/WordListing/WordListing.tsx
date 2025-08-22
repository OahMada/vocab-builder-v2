'use client';

import * as React from 'react';
import styled from 'styled-components';
import Word from '@/components/Word';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';
import { useWordsContext } from '@/components/WordsProvider';

function WordListing({ title }: { title: React.ReactNode }) {
	let { words } = useWordsContext();

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
				{words.map((item) => {
					return <Word key={item.id} piece={item.piece} isWord={item.isWord} IPA={item.isWord ? item.IPA : null} id={item.id} />;
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
