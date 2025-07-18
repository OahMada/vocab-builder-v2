'use client';

import * as React from 'react';
import styled from 'styled-components';
import Word from '@/components/Word';
import { segmentSentence } from '@/helpers';
import DescriptionText from '@/components/DescriptionText';

var TempSentence =
	'Si le temps était une rivière, je voguerais pour toujours dans le courant de ton sourire, porté par la douce gravité de ton cœur.';

function WordListing({ title }: { title: React.ReactNode }) {
	let segmentedSentence = segmentSentence(TempSentence);
	return (
		<>
			<TitleWrapper>
				{title}
				<DescriptionText>Tap or click on the word to load its phonetic symbol. Tap or click on the phonetic symbol to dismiss it.</DescriptionText>
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

var TitleWrapper = styled.div``;

var WordWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 5px;
`;
