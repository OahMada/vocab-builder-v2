'use client';

import * as React from 'react';

import { handleError } from '@/utils';

import ErrorDisplay from '@/components/ErrorDisplay';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	function handleReset() {
		reset();
	}
	let errorMsg = error.digest ? `Error: ${error.digest}` : handleError(error);

	return <ErrorDisplay errorMsg={errorMsg} handleReset={handleReset} />;
}
