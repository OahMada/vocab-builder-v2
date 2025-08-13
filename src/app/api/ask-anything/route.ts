import { NextRequest, NextResponse } from 'next/server';
import { QuestionTextSchema, SentenceToTranslateSchema } from '@/lib';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { delay, handleZodError } from '@/utils';
import { getCookie } from '@/helpers/getCookie';

export async function POST(request: NextRequest) {
	let body = await request.json();
	let questionResult = QuestionTextSchema.safeParse(body);
	if (!questionResult.success) {
		let errors = handleZodError(questionResult.error);
		return NextResponse.json({ error: errors.question![0] }, { status: 400 });
	}

	let sentence = await getCookie('user-input');
	let sentenceResult = SentenceToTranslateSchema.safeParse({ sentence });
	if (!sentenceResult.success) {
		let errors = handleZodError(sentenceResult.error);
		return NextResponse.json({ error: errors.sentence![0] }, { status: 400 });
	}

	try {
		let result = streamText({
			model: openai.responses('gpt-4.1'),
			system: `The user is gonna ask you a question about this specific sentence: ${sentenceResult.data.sentence}. Answer the question in the context of the sentence. You do not do anything else. Also don't repeat the sentence in your response.`,
			prompt: questionResult.data.question,
			abortSignal: request.signal,
			onAbort: ({ steps }) => {
				console.log('Stream aborted after', steps.length, 'steps');
			},
			onError: (error) => {
				console.log('error', error);
			},
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('Stream init error:', error);
		return NextResponse.json({ error: 'Failed to start stream.', details: String(error) }, { status: 500 });
	}
}
