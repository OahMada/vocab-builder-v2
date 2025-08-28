'use client';

import styled from 'styled-components';
import * as React from 'react';
import { SentenceWithPieces } from '@/lib';
import { useConstructedSentence, usePlayAudio } from '@/hooks';
import { AudioButton } from './SentenceListingEntry';

export function CompactSentenceListingEntry({ sentence, audioUrl, pieces }: Pick<SentenceWithPieces, 'audioUrl' | 'pieces' | 'sentence'>) {
	let sentencePieces = useConstructedSentence(sentence, pieces);
	let { isPlaying, playAudio, stopAudio } = usePlayAudio(audioUrl);

	return (
		<SentenceWrapper>
			{sentencePieces}
			<AudioButton
				style={{ '--icon-size': '16px', '--line-height': '1.6', '--font-size': '1.1rem' } as React.CSSProperties}
				isPlaying={isPlaying}
				playAudio={playAudio}
				stopAudio={stopAudio}
			/>
		</SentenceWrapper>
	);
}

var SentenceWrapper = styled.p`
	text-wrap: pretty;
	line-height: 1.3;
`;
