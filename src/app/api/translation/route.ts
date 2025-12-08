import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextAuthRequest } from 'next-auth';

import checkSubscriptionStatus from '@/app/actions/user/checkSubscriptionStatus';

import { SentenceSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { API_ABORT_TIMEOUT } from '@/constants';
import { auth } from '@/auth';

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		let subscriptionActive = await checkSubscriptionStatus(request.auth.user.id);
		if (!subscriptionActive) {
			return NextResponse.json({ error: "You need an active subscription to generate the sentence's translation." }, { status: 403 });
		}
	} catch (error) {
		console.error('Failed to check subscription status:', error);
		return NextResponse.json({ error: 'Failed to check subscription status.' }, { status: 500 });
	}

	let learningLanguage = request.auth.user.learningLanguage;
	let nativeLanguage = request.auth.user.nativeLanguage;
	if (!learningLanguage || !nativeLanguage) {
		return NextResponse.json({ error: 'Leaning language or native language is not set' }, { status: 400 });
	}

	let body = await request.json();
	let result = SentenceSchema.safeParse(body);
	if (!result.success) {
		let errors = handleZodError(result.error);
		return NextResponse.json({ error: errors.fieldErrors.sentence![0] }, { status: 400 });
	}

	try {
		let { text } = await generateText({
			model: openai.responses('gpt-4.1'),
			system: `You are a language teacher. In a precise and professional manner, translate any sentence you receive into ${nativeLanguage}, and translate it more literally, with less to no paraphrasing. Be careful: Chinese characters can appear in Japanese, but it is still Japanese, not Chinese. Otherwise, if the sentence is already in ${nativeLanguage}, do nothing and simply return it as is. Do not return anything other than the translation text.`,
			prompt: result.data.sentence,
			abortSignal: AbortSignal.timeout(API_ABORT_TIMEOUT),
		});
		return NextResponse.json({ data: text });
	} catch (error) {
		console.error('Generate translation init error:', error);
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			return NextResponse.json({ error: 'Request timed out. Please try again later' }, { status: 500 });
		}
		return NextResponse.json({ error: 'Failed to generate translation text.' }, { status: 500 });
	}
});
