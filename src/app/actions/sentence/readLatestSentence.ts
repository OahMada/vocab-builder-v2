'use server';

import prisma from '@/lib/prisma';
import { sentenceReadSelect, SentenceWithPieces } from '@/lib';

export default async function readLatestSentence(): Promise<{ error: string } | { data: SentenceWithPieces | null }> {
	try {
		// throw new Error('');
		let latestSentence = await prisma.sentence.findFirst({
			orderBy: {
				createdAt: 'desc',
			},
			select: sentenceReadSelect,
		});
		return { data: latestSentence };
	} catch (error) {
		console.error('fetch latest sentence failed', error);
		return { error: 'Failed to fetch the latest sentence.' };
	}
}
