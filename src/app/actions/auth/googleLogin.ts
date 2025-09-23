'use server';

import { revalidateTag } from 'next/cache';

import { CallbackSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { signIn } from '@/auth';
import { UNSTABLE_CACHE_TAG } from '@/constants';

export default async function login(data: unknown): Promise<{ error: string } | undefined> {
	let result = CallbackSchema.safeParse(data);

	if (!result.success) {
		let error = handleZodError(result.error);
		return { error: error.formErrors[0] };
	}

	let callbackUrl = result.data;

	// two return data examples
	// http://localhost:3000/api/auth/error?error=Configuration
	// http://localhost:3000/api/auth/verify-request?provider=resend&type=email
	try {
		await signIn('google', { redirect: true, redirectTo: callbackUrl || '/' });
		revalidateTag(UNSTABLE_CACHE_TAG.ACCOUNT_LINK_STATUS);
	} catch (error) {
		throw error;
	}
}
