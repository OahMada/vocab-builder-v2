import * as React from 'react';
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import { SentenceWithPieces, sentenceReadSelect } from '@/lib';
import ErrorDisplay from './ErrorDisplay';
import OptimisticSentenceListing from '@/components/OptimisticSentenceListing';

// TODO put a suspense boundary around this element

const getCachedSentences = unstable_cache(
	async () => {
		return await prisma.sentence.findMany({
			select: sentenceReadSelect,
			orderBy: { createdAt: 'desc' },
		});
	},
	[],
	{ revalidate: 3600, tags: ['sentences'] }
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

	return <OptimisticSentenceListing sentences={sentences} />;
}

export default SentenceListing;
