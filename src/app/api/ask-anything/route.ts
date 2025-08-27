import { NextRequest, NextResponse } from 'next/server';
import { FetchAnswerInputSchema } from '@/lib';
import { openai } from '@ai-sdk/openai';
import { streamText, simulateReadableStream } from 'ai';
import { MockLanguageModelV2 } from 'ai/test';
import { handleZodError } from '@/utils';

function toErrorStream(errorText: string) {
	let data = { type: 'error', errorText };
	let encoder = new TextEncoder();
	let stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
			controller.close();
		},
	});
	return stream;
}

export async function POST(request: NextRequest) {
	let body = await request.json();
	let parseResult = FetchAnswerInputSchema.safeParse(body);
	if (!parseResult.success) {
		let error = handleZodError(parseResult.error, 'prettify');
		let stream = toErrorStream(error);
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}

	// Fake helper for test
	let result = streamText({
		model: new MockLanguageModelV2({
			doStream: async () => ({
				stream: simulateReadableStream({
					chunks: [
						{ type: 'text-start', id: 'text-1' },
						{ type: 'text-delta', id: 'text-1', delta: "Governor Eudicot's welcoming speech this year is... short." },
						{ type: 'text-delta', id: 'text-1', delta: ', ' },
						{ type: 'text-delta', id: 'text-1', delta: 'Her frail body trembles as she welcomes you all to Vertumnalia with a dry, ' },
						{
							type: 'text-delta',
							id: 'text-1',
							delta: 'whispery voice, then has to be helped off stage. Like all of you, she has been feeling the effects of the famine.',
						},
						{ type: 'text-end', id: 'text-1' },
						{
							type: 'finish',
							finishReason: 'stop',
							logprobs: undefined,
							usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 },
						},
					],
				}),
			}),
		}),
		prompt: 'Hello, test!',
	});

	try {
		// throw new Error('error');
		let result = streamText({
			model: openai.responses('gpt-4.1'),
			system: `The user is gonna ask you a question about this specific sentence: ${parseResult.data.sentence}. Answer the question in detail and lean your explanation into grammar. Answer the question in the same language as the question. Structure the answer a bit for clarity. Don't repeat the sentence in your response.`,
			prompt: parseResult.data.question,
			abortSignal: AbortSignal.any([AbortSignal.timeout(20000), request.signal]),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('Stream init error:', error);
		let stream = toErrorStream('Failed to start stream. Please try again later.');
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}
}
