import { NextRequest, NextResponse } from 'next/server';
import { QuestionTextSchema, SentenceToTranslateSchema } from '@/lib';
import { openai } from '@ai-sdk/openai';
import { streamText, simulateReadableStream } from 'ai';
import { MockLanguageModelV2 } from 'ai/test';
import { handleZodError } from '@/utils';
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

	// Fake helper for test
	// let result = streamText({
	// 	model: new MockLanguageModelV2({
	// 		doStream: async () => ({
	// 			stream: simulateReadableStream({
	// 				chunks: [
	// 					{ type: 'text-start', id: 'text-1' },
	// 					{ type: 'text-delta', id: 'text-1', delta: "Governor Eudicot's welcoming speech this year is... short." },
	// 					{ type: 'text-delta', id: 'text-1', delta: ', ' },
	// 					{ type: 'text-delta', id: 'text-1', delta: 'Her frail body trembles as she welcomes you all to Vertumnalia with a dry, ' },
	// 					{
	// 						type: 'text-delta',
	// 						id: 'text-1',
	// 						delta: 'whispery voice, then has to be helped off stage. Like all of you, she has been feeling the effects of the famine.',
	// 					},
	// 					{ type: 'text-end', id: 'text-1' },
	// 					{
	// 						type: 'finish',
	// 						finishReason: 'stop',
	// 						logprobs: undefined,
	// 						usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 },
	// 					},
	// 				],
	// 			}),
	// 		}),
	// 	}),
	// 	prompt: 'Hello, test!',
	// });

	try {
		let result = streamText({
			model: openai.responses('gpt-4.1'),
			system: `The user is gonna ask you a question about this specific sentence: ${sentenceResult.data.sentence}. Answer the question in detail and lean your explanation into grammar. Answer the question in the same language as the question. Structure the answer a bit for clarity. Don't repeat the sentence in your response.`,
			// system: `Answer the question you received.`,
			prompt: questionResult.data.question,
			abortSignal: AbortSignal.any([AbortSignal.timeout(10000), request.signal]),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('Stream init error:', error);
		return NextResponse.json({ error: 'Failed to start stream.', details: String(error) }, { status: 500 });
	}
}
