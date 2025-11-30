'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as m from 'motion/react-m';
import { LayoutGroup } from 'motion/react';

import { CUSTOM_SPRING } from '@/constants';

import Word from '@/components/Word';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { Button } from '@/components/Button';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import CardWrapper from '@/components/CardWrapper';
import Title from '@/components/CardTitle';

function WordListing({ sentence }: { sentence: string }) {
	let { pieces } = useSentencePiecesContext();

	return (
		<CardWrapper layout={true} transition={CUSTOM_SPRING}>
			<TitleWrapper layout='position'>
				<Title>The Sentence</Title>
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
			<WordWrapper layout={true} transition={CUSTOM_SPRING}>
				{/* Layout group makes sure the wrapper can animate the height change */}
				<LayoutGroup>
					{pieces.map((item, index) => {
						if (typeof item === 'string') {
							return (
								<m.span key={index} layout='position' transition={CUSTOM_SPRING}>
									{item}
								</m.span>
							);
						}
						return <Word piece={item.word} IPA={item.IPA ? item.IPA : undefined} id={item.id} sentence={sentence} key={item.id} />;
					})}
				</LayoutGroup>
			</WordWrapper>
		</CardWrapper>
	);
}

export default WordListing;

var TitleWrapper = styled(m.div)`
	display: flex;
	gap: 5px;
	align-items: baseline;
`;

var WordWrapper = styled(m.div)`
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 5px;
	// hide the animating element
	overflow: hidden;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
