'use server';

import { LoginInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { signIn } from '@/auth';
import prisma from '@/lib/prisma';

async function deleteExpiredToken() {
	await prisma.verificationToken.deleteMany({
		where: { expires: { lt: new Date() } },
	});
}

async function emailLogIn(email: string, callback: string | undefined) {
	let signInResult = await signIn('resend', { email, redirect: false, redirectTo: callback || '/' });
	return signInResult;
}

export default async function login(data: unknown): Promise<{ error: string } | { data: string }> {
	let result = LoginInputSchema.safeParse(data);

	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error };
	}

	let { email, callback } = result.data;

	let [dbResult, signInResult] = await Promise.allSettled([deleteExpiredToken(), emailLogIn(email, callback)]);

	if (dbResult.status === 'rejected') {
		console.error('Failed to delete expired tokens:', dbResult.reason);
	}
	if (signInResult.status === 'rejected') {
		return { error: 'Something went wrong, please try again later' };
	}
	// two return data examples
	// http://localhost:3000/api/auth/error?error=Configuration
	// http://localhost:3000/api/auth/verify-request?provider=resend&type=email
	return { data: signInResult.value };
}
