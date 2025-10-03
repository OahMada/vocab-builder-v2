'use server';

import { unstable_cache } from 'next/cache';

import { IdSchema, userSelect } from '@/lib';
import { handleZodError } from '@/utils';
import prisma from '@/lib/prisma';
import { UNSTABLE_CACHE_TAG } from '@/constants';

var readLastExportedDate = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: Date | null }> {
		let result = IdSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error);
			return { error: error.formErrors[0] };
		}

		let userId = result.data;

		try {
			let user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: userSelect,
			});
			if (!user) {
				throw new Error(`No user found with id: ${userId}}`);
			}
			return { data: user?.lastExported };
		} catch (error) {
			console.error('could not read user data', error);
			return { error: "Failed to check the user's last synced date" };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.LAST_EXPORTED] }
);

export default readLastExportedDate;
