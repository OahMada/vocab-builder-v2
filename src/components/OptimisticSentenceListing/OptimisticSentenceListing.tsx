'use client';

import * as React from 'react';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import OptimisticAction from './OptimisticActionType';
import { SentenceWithPieces } from '@/lib';
import EmptyDisplay from './EmptyDisplay';
import { Loading, Wrapper } from './StyledComponents';

function OptimisticSentenceListing({ sentences }: { sentences: SentenceWithPieces[] }) {
	let [optimisticSentences, mutateSentences] = React.useOptimistic<SentenceWithPieces[], OptimisticAction>(sentences, (state, action) => {
		switch (action.type) {
			case 'delete':
				return state.filter((item) => item.id !== action.id);
			case 'update':
				return state;
			default:
				return state;
		}
	});

	if (optimisticSentences.length === 0) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper>
			<AccordionRoot>
				{optimisticSentences.map(({ id, ...rest }, index) => {
					return <SentenceListingEntry key={id} index={index} id={id} {...rest} mutateSentences={mutateSentences} />;
				})}
			</AccordionRoot>
			<Loading>Loading...</Loading>
		</Wrapper>
	);
}

export default OptimisticSentenceListing;
