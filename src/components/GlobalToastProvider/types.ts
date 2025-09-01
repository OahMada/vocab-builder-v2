import Toast from '@/components/Toast';

export type ToastMsg = { id: string } & React.ComponentProps<typeof Toast>;
export type ToastMsgs = ToastMsg[];
export interface GlobalToastContextType {
	addToToast: (toastMsg: ToastMsg) => void;
	resetToast: (id: string) => void;
}
