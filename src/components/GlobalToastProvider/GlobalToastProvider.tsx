'use client';

import Toast, { ToastProvider, ToastViewport } from '@/components/Toast';
import * as React from 'react';
import GlobalToastContext from './GlobalToastContext';
import { ToastMsgs, ToastMsg } from './types';

function GlobalToastProvider({ children }: { children: React.ReactNode }) {
	let [toastMsgs, setToastMsgs] = React.useState<ToastMsgs>([]);

	let resetToast = React.useCallback((id: string) => {
		setToastMsgs((prevState) => [...prevState.filter((item) => item.id !== id)]);
	}, []);

	let addToToast = React.useCallback(
		(toastMsg: ToastMsg) => {
			resetToast(toastMsg.id);
			setToastMsgs((prevState) => [...prevState, toastMsg]);
		},
		[resetToast]
	);

	let value = React.useMemo(
		() => ({
			addToToast,
			resetToast,
		}),
		[addToToast, resetToast]
	);

	return (
		<ToastProvider>
			<GlobalToastContext.Provider value={value}>{children}</GlobalToastContext.Provider>
			{toastMsgs.map(({ id, contentType, content, ...rest }) => (
				<Toast key={id} contentType={contentType} content={content} {...rest} />
			))}
			<ToastViewport $position='bottom' />
		</ToastProvider>
	);
}

export default GlobalToastProvider;
