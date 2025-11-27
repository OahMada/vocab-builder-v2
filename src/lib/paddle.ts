import 'server-only';
import { ApiError } from '@paddle/paddle-node-sdk';

import { Environment, LogLevel, Paddle, PaddleOptions } from '@paddle/paddle-node-sdk';

export function getPaddleInstance() {
	let paddleOptions: PaddleOptions = {
		environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as Environment) ?? Environment.sandbox,
		logLevel: LogLevel.error,
	};

	if (!process.env.PADDLE_API_KEY) {
		console.error('Paddle API key is missing');
	}

	return new Paddle(process.env.PADDLE_API_KEY!, paddleOptions);
}

export function handlePaddleSDKError(error: ApiError) {
	let fieldErrors: string = '';
	if (error.errors) {
		fieldErrors = error.errors.map((err: { field: string; message: string }) => `${err.field} : ${err.message}.`).join(' ');
	}
	console.error(`Error code: ${error.code}\nError detail: ${error.detail} ${fieldErrors ? `\nField Errors: ${fieldErrors}` : ''}`);
}
