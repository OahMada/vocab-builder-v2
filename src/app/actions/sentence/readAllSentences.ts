import { sentenceReadSelect, SentenceWithPieces } from '@/lib';
import prisma from '@/lib/prisma';

export default async function readAllSentences(): Promise<{ error: string } | { data: SentenceWithPieces[] }> {
	try {
		let sentences = await prisma.sentence.findMany({
			select: sentenceReadSelect,
			orderBy: { createdAt: 'desc' },
		});

		return { data: sentences };
	} catch (error) {
		console.error('fetch all sentences failed', error);
		return { error: 'Failed to fetch the sentences.' };
	}
}
