import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { streamText, simulateReadableStream } from 'ai';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { FetchAnswerInputSchema } from '@/lib';
import { delay, handleZodError } from '@/utils';

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

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let body = await request.json();
	let parseResult = FetchAnswerInputSchema.safeParse(body);
	if (!parseResult.success) {
		let error = handleZodError(parseResult.error, 'prettify');
		let stream = toErrorStream(error);
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}
	await delay(1500);

	try {
		// let result = streamText({
		// 	model: openai.responses('gpt-4.1'),
		// 	system: `You are a language teacher, the user is gonna ask you a question about a specific sentence: ${parseResult.data.sentence}. Answer the question in a precise, professional, detailed manner. Answer the question in the same language as the question. Structure the answer a bit for clarity. Don't repeat the sentence in your response.`,
		// 	prompt: parseResult.data.question,
		// 	abortSignal: AbortSignal.any([AbortSignal.timeout(API_ABORT_TIMEOUT), request.signal]),
		// });
		// return result.toUIMessageStreamResponse();
		return new Response(
			simulateReadableStream({
				initialDelayInMs: 1000, // Delay before the first chunk
				chunkDelayInMs: 300, // Delay between chunks
				chunks: [
					`data: {"type":"start","messageId":"msg-123"}\n\n`,
					`data: {"type":"text-start","id":"text-1"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":"This is a demo response because no actual API request is going to be made with the demo account.\\n\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\\n\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.\\n\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Integer in mauris eu nibh euismod gravida.\\n\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Duis ac tellus et risus vulputate vehicula.\\n"}\n\n`,
					`data: {"type":"text-delta","id":"text-1","delta":" Donec lobortis risus a elit. Etiam tempor.\\n"}\n\n`,
					`data: {"type":"text-end","id":"text-1"}\n\n`,
					`data: [DONE]\n\n`,
				],
			}).pipeThrough(new TextEncoderStream()),
			{
				status: 200,
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive',
					'x-vercel-ai-ui-message-stream': 'v1',
				},
			}
		);
	} catch (error) {
		console.error('Stream init error:', error);
		let stream = toErrorStream('Failed to start stream. Please try again later.');
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}
});
