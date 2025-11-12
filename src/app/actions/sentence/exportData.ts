'use server';

import updateSyncDate from '../user/updateSyncDate';

import prisma from '@/lib/prisma';
import verifySession from '@/helpers/dal';
import { sentenceReadSelect, type SentenceWithPieces } from '@/lib';

export default async function exportData(): Promise<{ error: string } | { data: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	let userId = session.id;
	let userData: SentenceWithPieces[] = [];
	try {
		userData = await prisma.sentence.findMany({
			where: { userId },
			select: sentenceReadSelect,
			orderBy: { updatedAt: 'asc' },
		});
	} catch (error) {
		console.error('read all sentences failed', error);
		return { error: 'Failed to read the sentences' };
	}

	try {
		await updateSyncDate(userId);
	} catch (error) {
		console.error('update sync date failed', error);
		return {
			error: `Failed to update last synced date`,
		};
	}

	let json = JSON.stringify(userData, null, 2);
	return { data: json };
}
