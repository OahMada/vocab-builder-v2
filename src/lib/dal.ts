import 'server-only';

import { auth } from '@/auth';
import type { Session } from 'next-auth';

export default async function verifySession(): Promise<null | Session['user']> {
	let session = await auth();

	if (!session?.user.id) {
		return null;
	} else {
		return session.user;
	}
}
