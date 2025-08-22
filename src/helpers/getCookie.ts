import 'server-only';

import { cookies } from 'next/headers';
export async function getCookie(name: string) {
	let cookieStore = await cookies();
	let data = cookieStore.get(name);
	if (!data) {
		return;
	}

	return data.value;
}
