import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextAuthRequest } from 'next-auth';

import { SentenceSchema } from '@/lib';
import { delay, handleZodError } from '@/utils';
import { API_ABORT_TIMEOUT } from '@/constants';
import { auth } from '@/auth';

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let nativeLanguage = request.auth.user.nativeLanguage;
	if (!nativeLanguage) {
		return NextResponse.json({ error: 'Translation language not set' }, { status: 400 });
	}

	let body = await request.json();
	let result = SentenceSchema.safeParse(body);
	if (!result.success) {
		let errors = handleZodError(result.error);
		return NextResponse.json({ error: errors.fieldErrors.sentence![0] }, { status: 400 });
	}
	await delay(1500);
	// return NextResponse.json({ error: 'Failed to generate translation text. ' }, { status: 500 });
	return NextResponse.json({ data: 'This is a demo response because no actual API request is going to be made with the demo account.' });

	try {
		let { text } = await generateText({
			model: openai.responses('gpt-4.1'),
			system: `Translate the sentence you receive into ${nativeLanguage}. If the sentence is already in ${nativeLanguage}, do nothing and simply return it as is.`,
			// @ts-expect-error stop test case warning
			prompt: result.data.sentence,
			abortSignal: AbortSignal.timeout(API_ABORT_TIMEOUT),
		});
		return NextResponse.json({ data: text });
	} catch (error) {
		console.error('Generate translation init error:', error);
		// @ts-expect-error stop test case warning
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			return NextResponse.json({ error: 'Request timed out. Please try again later' }, { status: 500 });
		}
		return NextResponse.json({ error: 'Failed to generate translation text' }, { status: 500 });
	}
});
