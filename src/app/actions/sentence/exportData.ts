'use server';

import { readAllSentences } from './readAllSentences';
import verifySession from '@/lib/dal';

export default async function exportData(): Promise<{ error: string } | { data: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	let userId = session.id;
	let userData = await readAllSentences({ userId });
	if ('error' in userData) {
		console.error('read all sentence data action failed: ', userData.error);
		return { error: 'Failed to fetch account data' };
	}

	let json = JSON.stringify(userData.data, null, 2);

	return { data: json };
}
