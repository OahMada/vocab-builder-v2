import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { NextAuthRequest } from 'next-auth';
import { readAllSentences } from '@/app/actions/sentence/readAllSentences';

export var GET = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let userId = request.auth.user.id;
	let userData = await readAllSentences({ userId });
	if ('error' in userData) {
		console.error('read all sentence data action failed: ', userData.error);
		return NextResponse.json({ error: 'Failed to fetch account data' }, { status: 500 });
	}

	let json = JSON.stringify(userData.data, null, 2);

	return new NextResponse(json, {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': 'attachment; filename="data.json"',
		},
	});
});
