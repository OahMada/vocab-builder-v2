'use client';

import * as React from 'react';

interface SentenceSubmittingContextType {
	isSubmitting: boolean;
	startTransition: React.TransitionStartFunction;
}

var SentenceSubmittingContext = React.createContext<SentenceSubmittingContextType | null>(null);

export default SentenceSubmittingContext;
