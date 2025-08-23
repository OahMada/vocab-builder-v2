import { NextResponse } from 'next/server';
import { SentenceSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { getCookie } from '@/helpers/getCookie';
import { escapeForSSML } from '@/helpers/escapeForSSML';
import { SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat } from 'microsoft-cognitiveservices-speech-sdk';

export async function POST() {
	let sentence = await getCookie('user-input');
	let sentenceResult = SentenceSchema.safeParse({ sentence });
	if (!sentenceResult.success) {
		let errors = handleZodError(sentenceResult.error);
		return NextResponse.json({ error: errors.fieldErrors.sentence![0] }, { status: 400 });
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
				${escapeForSSML(sentenceResult.data.sentence)}
			</prosody>
		</voice>
	</speak>`;
	// https://github.com/vercel/next.js/issues/50572#issuecomment-1569775155
	return new Promise<NextResponse>((resolve) => {
		synthesizer.speakSsmlAsync(
			ssml,
			(result) => {
				// throw new Error('test');
				let audioData = Buffer.from(result.audioData);
				synthesizer.close();
				resolve(NextResponse.json({ result: audioData.toString('base64') }));
			},
			(err) => {
				console.error(err);
				synthesizer.close();
				resolve(NextResponse.json({ error: 'Generating speech failed, please try again later.' }, { status: 500 }));
			}
		);
	});
}
