import Toast from '@/components/Toast';
import { TOAST_ID } from '@/constants';

type IPAId = `IPA_${string}`;

export type ToastId = Exclude<(typeof TOAST_ID)[keyof typeof TOAST_ID], 'IPA_'> | IPAId;

export type ToastMsg = { id: ToastId } & React.ComponentProps<typeof Toast>;
export type ToastMsgs = ToastMsg[];
export interface GlobalToastContextType {
	addToToast: (toastMsg: ToastMsg) => void;
	resetToast: (id: ToastId) => void;
}
