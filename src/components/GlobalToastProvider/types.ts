import Toast from '@/components/Toast';
import { ToastId } from '@/types';

export type ToastMsg = { id: ToastId } & React.ComponentProps<typeof Toast>;
export type ToastMsgs = ToastMsg[];
export interface GlobalToastContextType {
	addToToast: (toastMsg: ToastMsg) => void;
	removeFromToast: (id: ToastId) => void;
}
