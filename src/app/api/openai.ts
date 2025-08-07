import OpenAI from 'openai';
import { handleError } from '@/utils';

var apiKey = process.env['OPENAI_API_KEY'];
if (!apiKey) {
	throw new Error('Missing OpenAI API key');
}

var openaiClient = new OpenAI({
	apiKey,
});

export default openaiClient;

export function handleOpenAIError(err: unknown) {
	if (err instanceof OpenAI.APIError) {
		console.log(err.requestID);
		console.log(err.status); // 400
		console.log(err.name); // BadRequestError
		console.log(err.headers); // {server: 'nginx', ...}
	} else {
		console.log(handleError(err));
	}
}
