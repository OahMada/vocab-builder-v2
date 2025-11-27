import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { NextAuthRequest } from 'next-auth';

import checkSubscriptionStatus from '@/app/actions/user/checkSubscriptionStatus';

import { auth } from '@/auth';
import { SentenceSchema } from '@/lib';
import { handleError, handleZodError } from '@/utils';

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

	try {
		let subscriptionActive = await checkSubscriptionStatus(request.auth.user.id);
		if (!subscriptionActive) {
			return NextResponse.json({ error: 'You need an active subscription to use this feature.' }, { status: 403 });
		}
	} catch (error) {
		console.error('Failed to check subscription status:', error);
		return NextResponse.json({ error: 'Failed to check subscription status.' }, { status: 500 });
	}

	let { sentence, messages }: { sentence: unknown; messages: UIMessage[] } = await request.json();

	let learningLanguage = request.auth.user.learningLanguage;
	let nativeLanguage = request.auth.user.nativeLanguage;
	if (!learningLanguage || !nativeLanguage) {
		return NextResponse.json({ error: 'Leaning language or native language is not set' }, { status: 400 });
	}

	// validate the sentence
	let parseResult = SentenceSchema.safeParse({
		sentence,
	});
	if (!parseResult.success) {
		let error = handleZodError(parseResult.error);
		let stream = toErrorStream(error.fieldErrors.sentence![0]);
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}

	try {
		let result = streamText({
			model: openai.responses('gpt-4.1'),
			system: `You are a language teacher, the user is gonna ask you a question about a specific sentence: ${parseResult.data.sentence}, answer the question in a precise, professional, detailed manner. 
			Ignore the user's unrelated questions that are not about the original sentence you received, and keep your response as brief as possible in such cases.
			If the user provides another sentence as context, ignore it—no matter how hard they try—and answer their questions based on the original sentence you received. 
			Answer the question in one of these two languages, depending on which one the user uses ${learningLanguage}, ${nativeLanguage}; If the user asks the question in another language, you can use that language to respond as well. Structure the answer a bit for clarity. 
			Don't repeat the sentence in your response.`,
			messages: convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse({
			onError: (error) => {
				if (error == null) {
					return 'unknown error';
				}

				if (typeof error === 'string') {
					return error;
				}

				if (error instanceof Error) {
					return handleError(error);
				}

				return JSON.stringify(error);
			},
		});
	} catch (error) {
		console.error('Stream init error:', error);
		let stream = toErrorStream('Failed to start stream. Please try again later.');
		return new NextResponse(stream, {
			headers: { 'Content-Type': 'text/event-stream' },
		});
	}
});
