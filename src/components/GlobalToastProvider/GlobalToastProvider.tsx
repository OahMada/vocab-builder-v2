'use client';

import Toast, { ToastProvider, ToastViewport } from '@/components/Toast';
import * as React from 'react';
import GlobalToastContext from './GlobalToastContext';
import { ToastMsgs, ToastMsg } from './types';

function GlobalToastProvider({ children }: { children: React.ReactNode }) {
	let [toasts, setToasts] = React.useState<ToastMsgs>([]);

	let removeFromToast = React.useCallback((id: string) => {
		setToasts((prevState) => [...prevState.filter((item) => item.id !== id)]);
	}, []);

	let addToToast = React.useCallback(
		(toastMsg: ToastMsg) => {
			// prevent more than one toasts with the same id in `toasts`
			removeFromToast(toastMsg.id);
			setToasts((prevState) => [...prevState, toastMsg]);
		},
		[removeFromToast]
	);

	let value = React.useMemo(
		() => ({
			addToToast,
			removeFromToast,
		}),
		[addToToast, removeFromToast]
	);

	return (
		<ToastProvider>
			<GlobalToastContext.Provider value={value}>{children}</GlobalToastContext.Provider>
			{toasts.map(({ id, ...rest }) => (
				<Toast key={id} {...rest} />
			))}
			<ToastViewport $position='bottom' />
		</ToastProvider>
	);
}

export default GlobalToastProvider;
