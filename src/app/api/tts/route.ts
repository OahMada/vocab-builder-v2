import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat } from 'microsoft-cognitiveservices-speech-sdk';

import { SentenceSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { auth } from '@/auth';

function escapeForSSML(text: string) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
	}
	let body = await request.json();
	let sentenceResult = SentenceSchema.safeParse(body);
	if (!sentenceResult.success) {
		let errors = handleZodError(sentenceResult.error);
		return NextResponse.json({ error: errors.formErrors[0] }, { status: 400 });
	}

	if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
		return NextResponse.json({ error: 'Azure api key or region config missing.' }, { status: 400 });
	}

	let speechConfig = SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);

	// TODO get language setting from user data
	speechConfig.speechSynthesisVoiceName = 'en-US-AriaNeural';
	speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

	let synthesizer = new SpeechSynthesizer(speechConfig);

	let ssml = `
	<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
		<voice name="en-US-AriaNeural">
			<prosody rate="-20%" pitch="low">
				${escapeForSSML(sentenceResult.data)}
			</prosody>
		</voice>
	</speak>`;
	// https://github.com/vercel/next.js/issues/50572#issuecomment-1569775155
	return new Promise<NextResponse>((resolve) => {
		synthesizer.speakSsmlAsync(
			ssml,
			(result) => {
				let audioData = Buffer.from(result.audioData);
				synthesizer.close();
				resolve(NextResponse.json({ data: audioData.toString('base64') }));
			},
			(err) => {
				console.error(err);
				synthesizer.close();
				resolve(NextResponse.json({ error: 'Generating speech failed, please try again later.' }, { status: 500 }));
			}
		);
	});
});
