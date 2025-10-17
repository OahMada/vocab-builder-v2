import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { FetchAnswerInputSchema } from '@/lib';
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

	try {
		let result = streamText({
			model: openai.responses('gpt-4.1'),
			system: `You are a language teacher, the user is gonna ask you a question about a specific sentence: ${parseResult.data.sentence}. Answer the question in a precise, professional, detailed manner. Answer the question in the same language as the question. Structure the answer a bit for clarity. Don't repeat the sentence in your response.`,
			prompt: parseResult.data.question,
			abortSignal: request.signal,
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('Stream init error:', error);
		let stream = toErrorStream('Failed to start stream. Please try again later.');
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}
});
