import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextAuthRequest } from 'next-auth';

import { FetchIPAInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { API_ABORT_TIMEOUT } from '@/constants';
import { auth } from '@/auth';

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let EnglishIPAFlavour = request.auth.user.EnglishIPAFlavour;

	let body = await request.json();

	let result = FetchIPAInputSchema.safeParse(body);
	if (!result.success) {
		let errors = handleZodError(result.error, 'prettify');
		return NextResponse.json({ error: errors }, { status: 400 });
	}

	let { word, sentence } = result.data;

	try {
		let { text } = await generateText({
			model: openai.responses('gpt-4.1'),
			system: `Provide the precise IPA (phonetic transcription) for each word, enclosing each in slashes (e.g., /ˈwɜːd/). Use the context of the sentence to determine the appropriate transcription: ${sentence}. If a word has multiple possible IPA forms, choose the one that best fits the context.  ${
				EnglishIPAFlavour ? `If the sentence is in English, provide the IPA in ${EnglishIPAFlavour} flavour.` : ''
			}`,
			prompt: word,
			abortSignal: AbortSignal.timeout(API_ABORT_TIMEOUT),
		});
		return NextResponse.json({ data: text });
	} catch (error) {
		console.error('Generate IPA init error:', error);
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			return NextResponse.json({ error: 'Request timed out. Please try again later' }, { status: 500 });
		}
		return NextResponse.json({ error: 'Failed to generate IPA' }, { status: 500 });
	}
});
