import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

import { FetchIPAInputSchema } from '@/lib';
import { delay, handleZodError } from '@/utils';
import { API_ABORT_TIMEOUT } from '@/constants';

export async function POST(request: NextRequest) {
	let body = await request.json();

	let result = FetchIPAInputSchema.safeParse(body);
	// let result = WordSchema.safeParse({ word: 'a' });
	if (!result.success) {
		let errors = handleZodError(result.error, 'prettify');
		return NextResponse.json({ error: errors }, { status: 400 });
	}

	// await delay(2000);
	// return NextResponse.json({ error: 'Failed to generate IPA.' }, { status: 500 });

	// return NextResponse.json({ result: '/ˈmɔːrnɪŋ/' }, { status: 200 });

	// TODO ready IPA flavour from user data

	let { word, sentence } = result.data;

	try {
		let { text } = await generateText({
			model: openai.responses('gpt-4.1'),
			system: `Provide the UK IPA (phonetic transcription) for each word you receive, and enclose the result in slashes (e.g., /ˈwɜːd/). Provide the IPA according to the context of the sentence: ${sentence}. If a word has multiple IPA options, provide the one that best fits the context.`,
			// @ ts-expect-error stop test case warning
			prompt: word,
			abortSignal: AbortSignal.timeout(API_ABORT_TIMEOUT),
		});
		return NextResponse.json({ result: text });
	} catch (error) {
		console.error('Generate IPA init error:', error);
		// @ ts-expect-error stop test case warning
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			return NextResponse.json({ error: 'Request timed out. Please try again later.' }, { status: 500 });
		}
		return NextResponse.json({ error: 'Failed to generate IPA' }, { status: 500 });
	}
}
