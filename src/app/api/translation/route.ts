import { NextRequest, NextResponse } from 'next/server';
import { SentenceToTranslateSchema } from '@/lib';
import openaiClient, { handleOpenAIError } from '../openai';
import { delay, handleError, handleZodError } from '@/utils';

// TODO load language setting from user setting

export async function POST(request: NextRequest) {
	let body = await request.json();

	let result = SentenceToTranslateSchema.safeParse(body);
	// let result = TranslationSchema.safeParse({ sentence: 'abd' });
	if (!result.success) {
		let errors = handleZodError(result.error);
		// await delay(2000);
		return NextResponse.json({ error: errors.sentence![0] }, { status: 400 });
	}
	await delay(2000);
	// return NextResponse.json({ error: 'Failed to generate translation text.' }, { status: 500 });
	return NextResponse.json({ result: '默认情况下，SWR 库中的 useSWRMutation 不会在组件挂载时自动触发 mutation。' });

	try {
		let response = await openaiClient.responses.create({
			model: 'gpt-4.1',
			instructions: `Translate the sentence you receive into ${'Chinese'}. If the sentence is already in ${'Chinese'}, do nothing and simply return it as is.`,
			input: result.data?.sentence,
		});
		return NextResponse.json({ result: response.output_text });
	} catch (error) {
		handleOpenAIError(error);
		return NextResponse.json({ error: 'Failed to generate translation text.' }, { status: 500 });
	}
}
