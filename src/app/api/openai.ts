import OpenAI from 'openai';

var apiKey = process.env['OPENAI_API_KEY'];
if (!apiKey) {
	throw new Error('Missing OpenAI API key');
}

var openaiClient = new OpenAI({
	apiKey,
});

export default openaiClient;
