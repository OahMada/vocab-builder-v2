'use server';

import { unstable_cache } from 'next/cache';

import { UserIdSchema } from '@/lib';
import prisma from '@/lib/prisma';
import { handleZodError } from '@/utils';
import { UNSTABLE_CACHE_TAG } from '@/constants';

var checkAccountLinkStatus = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: string | undefined }> {
		let result = UserIdSchema.safeParse(data);

		if (!result.success) {
			let error = handleZodError(result.error);
			return { error: error.formErrors[0] };
		}

		let userId = result.data;

		try {
			let foundAccount = await prisma.account.findFirst({
				where: {
					provider: 'google',
					userId,
				},
				select: { id: true },
			});

			return { data: foundAccount?.id || undefined };
		} catch (error) {
			console.error('failed to check account link status: ', error);
			return { error: 'Failed to check for google account link status' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.ACCOUNT_LINK_STATUS] }
);

export default checkAccountLinkStatus;
