'use server';

import { revalidateTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { userSelect } from '@/lib/prismaSelect';
import { UNSTABLE_CACHE_TAG } from '@/constants';
import { getLocalDate } from '@/utils';

export default async function updateSyncDate(userId: string) {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: {
				lastSynced: getLocalDate(),
			},
			select: userSelect,
		});
	} catch (error) {
		throw error;
	}

	revalidateTag(UNSTABLE_CACHE_TAG.LAST_SYNCED);
}
