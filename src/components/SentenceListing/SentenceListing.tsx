import * as React from 'react';
import { unstable_cache } from 'next/cache';
import { AccordionRoot } from '@/components/Accordion';
import SentenceListingEntry from '@/components/SentenceListingEntry';
import { Loading, Wrapper } from './StyledComponents';
import prisma from '@/lib/prisma';
import { SentenceWithPieces, sentenceSelect } from '@/lib';
import ErrorDisplay from './ErrorDisplay';
import EmptyDisplay from './EmptyDisplay';

// TODO put a suspense boundary around this element

const getCachedSentences = unstable_cache(
	async () => {
		return await prisma.sentence.findMany({
			select: sentenceSelect,
			orderBy: { createdAt: 'desc' },
		});
	},
	['sentences'],
	{ revalidate: 3600, tags: ['posts'] }
);

async function SentenceListing() {
	let sentences: SentenceWithPieces[];
	try {
		// throw new Error('test');
		sentences = await getCachedSentences();
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
