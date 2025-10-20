import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { SpeechConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat } from 'microsoft-cognitiveservices-speech-sdk';

import { SentenceSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { auth } from '@/auth';
import { TTS_SPEECH_VOICE } from '@/constants';

function escapeForSSML(text: string) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let learningLanguage = request.auth.user.learningLanguage;
	let EnglishIPAFlavour = request.auth.user.EnglishIPAFlavour;
	if (!learningLanguage) {
		return NextResponse.json({ error: 'Leaning language not set' }, { status: 400 });
	}

	let TTSVoice: string;
	if (learningLanguage === 'English' && EnglishIPAFlavour) {
		TTSVoice = TTS_SPEECH_VOICE[learningLanguage][EnglishIPAFlavour];
	} else {
		TTSVoice = TTS_SPEECH_VOICE[learningLanguage] as string;
	}

	let body = await request.json();
	let sentenceResult = SentenceSchema.safeParse(body);
	if (!sentenceResult.success) {
		let errors = handleZodError(sentenceResult.error);
		return NextResponse.json({ error: errors.fieldErrors.sentence![0] }, { status: 400 });
	}

	if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
		return NextResponse.json({ error: 'Azure api key or region config missing' }, { status: 400 });
	}

	let speechConfig = SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
	speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;
	let synthesizer = new SpeechSynthesizer(speechConfig);

	let ssml = `
	<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
		<voice name="${TTSVoice}">
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
				let audioData = Buffer.from(result.audioData);
				// let hash = createHash('sha1').update(audioData).digest().subarray(0, 8).toString('base64');
				synthesizer.close();
				resolve(NextResponse.json({ data: audioData.toString('base64') }));
			},
			(err) => {
				console.error(err);
				synthesizer.close();
				resolve(NextResponse.json({ error: 'Generating speech failed, please try again later' }, { status: 500 }));
			}
		);
	});
});
