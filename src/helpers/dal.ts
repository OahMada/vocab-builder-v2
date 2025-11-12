import 'server-only';

import type { Session } from 'next-auth';

import { auth } from '@/auth';

export default async function verifySession(): Promise<null | Session['user']> {
	let session = await auth();

	if (!session?.user.id) {
		return null;
	} else {
		return session.user;
	}
}
