'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as m from 'motion/react-m';
import { LayoutGroup, LazyMotion } from 'motion/react';

import Word from '@/components/Word';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { Button } from '@/components/Button';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import CardWrapper from '@/components/CardWrapper';

var loadFeatures = () => import('@/lib/motionDomMax').then((res) => res.default);

var customSpring = { type: 'spring', stiffness: 250, damping: 28, duration: 0.3 } as const;

function WordListing({ title, sentence }: { title: React.ReactNode; sentence: string }) {
	let { pieces } = useSentencePiecesContext();

	// WordWrapper & CardWrapper height shrink won't animate, this is the best result I can get
	return (
		<LazyMotion features={loadFeatures}>
			<CardWrapper as={m.div} layout={true} transition={customSpring}>
				<TitleWrapper layout='position'>
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
				<WordWrapper layout={true} transition={customSpring}>
					{/* with phonetic symbol's layoutId, the horizontal position change when removing Phonetic Symbol can be animated */}
					<LayoutGroup>
						{pieces.map((item, index) => {
							if (typeof item === 'string') {
								return (
									<m.span key={index} layout='position'>
										{item}
									</m.span>
								);
							}
							return <Word piece={item.word} IPA={item.IPA ? item.IPA : undefined} id={item.id} sentence={sentence} key={item.id} />;
						})}
					</LayoutGroup>
				</WordWrapper>
			</CardWrapper>
		</LazyMotion>
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
