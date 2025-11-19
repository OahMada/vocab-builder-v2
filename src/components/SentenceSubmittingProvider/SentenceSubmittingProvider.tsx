'use client';

import * as React from 'react';

import SentenceSubmittingContext from './SentenceSubmittingContext';

function SentenceSubmittingProvider({ children }: { children: React.ReactNode }) {
	let [isSubmitting, startTransition] = React.useTransition();

	let value = React.useMemo(() => ({ isSubmitting, startTransition }), [isSubmitting]);

	return <SentenceSubmittingContext.Provider value={value}>{children}</SentenceSubmittingContext.Provider>;
}

export default SentenceSubmittingProvider;
