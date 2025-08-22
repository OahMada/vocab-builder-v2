import * as React from 'react';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import { Loading, Wrapper } from './StyledComponents';
import prisma from '@/lib/prisma';
import { SentenceWithPieces, sentenceSelect } from './sentenceSelect';
import ErrorDisplay from './ErrorDisplay';
import EmptyDisplay from './EmptyDisplay';

// TODO put a suspense boundary around this element
async function SentenceListing() {
	let sentences: SentenceWithPieces[];
	try {
		// throw new Error('test');
		sentences = await prisma.sentence.findMany({
			select: sentenceSelect,
		});
	} catch (err) {
		console.error(err);
		return <ErrorDisplay />;
	}

	if (sentences.length === 0) {
		return <EmptyDisplay />;
	}

	return (
		<Wrapper>
			<AccordionRoot>
				{sentences.map(({ id, ...rest }, index) => {
					return <SentenceListingEntry key={id} index={index} id={id} {...rest} />;
				})}
			</AccordionRoot>
			<Loading>Loading...</Loading>
		</Wrapper>
	);
}

export default SentenceListing;
