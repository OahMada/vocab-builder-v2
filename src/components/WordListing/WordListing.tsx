'use client';

import * as React from 'react';
import styled from 'styled-components';
import Word from '@/components/Word';
import { segmentSentence } from '@/helpers';
import DescriptionText from '@/components/DescriptionText';
import Spacer from '@/components/Spacer';

var TempSentence =
	'Si le temps était une rivière, je voguerais pour toujours dans le courant de ton sourire, porté par la douce gravité de ton cœur.';

function WordListing() {
	let segmentedSentence = segmentSentence(TempSentence);
	return (
		<Wrapper>
			<Title>Your Sentence</Title>
			<DescriptionText>Tap or click on the word to load its phonetic symbol. Tap or click on the phonetic symbol to dismiss it.</DescriptionText>
			<Spacer size={18} />
			<WordWrapper>
				{segmentedSentence.map((item) => {
					return <Word key={item.id} segment={item.segment} isWord={item.isWordLike} />;
				})}
			</WordWrapper>
		</Wrapper>
	);
}

export default WordListing;

var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-primary);
	width: 100%;
	padding: 12px;
	border-radius: 24px;
`;

var WordWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 6px;
`;

var Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1;
	margin-top: 8px;
`;
