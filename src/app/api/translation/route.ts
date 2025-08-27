import { NextRequest, NextResponse } from 'next/server';
import { SentenceSchema } from '@/lib';
import { delay, handleZodError } from '@/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// TODO load language setting from user setting

export async function POST(request: NextRequest) {
	let body = await request.json();
	let result = SentenceSchema.safeParse(body);
	if (!result.success) {
		let errors = handleZodError(result.error);
		return NextResponse.json({ error: errors.fieldErrors.sentence![0] }, { status: 400 });
	}
	// await delay(2000);
	// return NextResponse.json({ error: 'Failed to generate translation text.' }, { status: 500 });
	// return NextResponse.json({ result: '默认情况下，SWR 库中的 useSWRMutation 不会在组件挂载时自动触发 mutation。' });

	try {
		let { text } = await generateText({
			model: openai.responses('gpt-4.1'),
			system: `Translate the sentence you receive into ${'Chinese'}. If the sentence is already in ${'Chinese'}, do nothing and simply return it as is.`,
			// @ ts-expect-error stop test case warning
			prompt: result.data.sentence,
			abortSignal: AbortSignal.timeout(10000),
		});
		return NextResponse.json({ result: text });
	} catch (error) {
		console.error('Generate translation init error:', error);
		// @ ts-expect-error stop test case warning
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			return NextResponse.json({ error: 'Request timed out. Please try again later.' }, { status: 500 });
		}
		return NextResponse.json({ error: 'Failed to generate translation text.' }, { status: 500 });
	}
}
