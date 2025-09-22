'use server';

import { LoginInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { signIn } from '@/auth';
import prisma from '@/lib/prisma';

async function deleteExpiredToken(email: string) {
	await prisma.verificationToken.deleteMany({
		where: { identifier: email, expires: { lt: new Date() } },
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

	let [dbResult, signInResult] = await Promise.allSettled([deleteExpiredToken(email), emailLogIn(email, callback)]);

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
