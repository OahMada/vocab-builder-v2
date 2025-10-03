'use server';

import prisma from '@/lib/prisma';
import { userSelect } from '@/lib/prismaSelect';
import { revalidateTag } from 'next/cache';
import { UNSTABLE_CACHE_TAG } from '@/constants';

export default async function updateExportedDate(userId: string) {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: {
				lastExported: new Date(),
			},
			select: userSelect,
		});
	} catch (error) {
		throw error;
	}

	revalidateTag(UNSTABLE_CACHE_TAG.LAST_EXPORTED);
}
