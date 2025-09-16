'use server';

import { LoginInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { signIn } from '@/auth';

export default async function login(data: unknown): Promise<{ error: string } | { data: string }> {
	let result = LoginInputSchema.safeParse(data);

	if (!result.success) {
		let errors = handleZodError(result.error);
		return { error: errors.fieldErrors.email![0] as string };
	}

	// two return data examples
	// http://localhost:3000/api/auth/error?error=Configuration
	// http://localhost:3000/api/auth/verify-request?provider=resend&type=email
	let signInResult = await signIn('resend', { email: result.data.email, redirect: false });
	return { data: signInResult };
}
