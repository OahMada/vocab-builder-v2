import 'server-only';

import { auth } from '@/auth';

export default async function verifySession(): Promise<null | { userId: string }> {
	let session = await auth();

	if (!session?.user?.id) {
		return null;
	} else {
		return { userId: session.user.id };
	}
}
