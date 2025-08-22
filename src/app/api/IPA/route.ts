import { NextRequest, NextResponse } from 'next/server';
import { WordSchema } from '@/lib';
import { delay, handleZodError } from '@/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: NextRequest) {
	let body = await request.json();

	let result = WordSchema.safeParse(body);
	// let result = WordSchema.safeParse({ word: 'a' });
	if (!result.success) {
		let errors = handleZodError(result.error);
		return NextResponse.json({ error: errors.fieldErrors.word![0] }, { status: 400 });
	}

	// await delay(2000);
	// return NextResponse.json({ error: 'Failed to generate IPA.' }, { status: 500 });

	return NextResponse.json({ result: '/ˈmɔːrnɪŋ/' }, { status: 200 });

	try {
		let { text } = await generateText({
			model: openai.responses('gpt-4.1'),
			system: 'Provide the IPA or phonetic transcription for each word you receive, and enclose the result in slashes (e.g., /ˈwɜːd/).',
			// @ts-expect-error stop test case warning
			prompt: result.data.word,
			abortSignal: AbortSignal.timeout(10000),
		});
		return NextResponse.json({ result: text });
	} catch (error) {
		console.error('Generate IPA init error:', error);
		// @ts-expect-error stop test case warning
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			return NextResponse.json({ error: 'Request timed out. Please try again later.' }, { status: 500 });
		}
		return NextResponse.json({ error: 'Failed to generate IPA' }, { status: 500 });
	}
}
