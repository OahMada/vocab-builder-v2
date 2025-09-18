'use server';

import { LoginInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { signIn } from '@/auth';

export default async function login(data: unknown): Promise<{ error: string } | { data: string }> {
	let result = LoginInputSchema.safeParse(data);

	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error };
	}

	let { email, callback } = result.data;

	// two return data examples
	// http://localhost:3000/api/auth/error?error=Configuration
	// http://localhost:3000/api/auth/verify-request?provider=resend&type=email
	let signInResult = await signIn('resend', { email, redirect: false, redirectTo: callback || '/' });
	return { data: signInResult };
}
