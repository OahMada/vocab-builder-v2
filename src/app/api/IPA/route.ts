import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { WordSchema } from '@/lib';
import openaiClient from '../openai';
import { delay } from '@/utils';

export async function POST(request: NextRequest) {
	let body = await request.json();

	let result = WordSchema.safeParse(body);
	// let result = WordSchema.safeParse({ word: 'a' });
	if (!result.success) {
		let flattenedError = z.flattenError(result.error);
		return NextResponse.json({ error: flattenedError.fieldErrors.word![0] }, { status: 400 });
	}

	await delay(2000);
	return NextResponse.json({ result: '/ˈmɔːrnɪŋ/' }, { status: 200 });

	try {
		let response = await openaiClient.responses.create({
			model: 'gpt-4.1',
			instructions: 'Provide the IPA or phonetic transcription for each word you receive, and enclose the result in slashes (e.g., /ˈwɜːd/).',
			input: result.data?.word,
		});
		return NextResponse.json({ result: response.output_text });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
	}
}
