import Toast from '@/components/Toast';
import { TOAST_ID } from '@/constants';

type IPAId = `IPA_${string}`;
type AudioPlayingWithUrl = `audio_playing_${string}`;

type ToastId = Exclude<(typeof TOAST_ID)[keyof typeof TOAST_ID], 'IPA_' | 'audio_playing_'> | IPAId | AudioPlayingWithUrl;

export type ToastMsg = { id: ToastId } & React.ComponentProps<typeof Toast>;
export type ToastMsgs = ToastMsg[];
export interface GlobalToastContextType {
	addToToast: (toastMsg: ToastMsg) => void;
	removeFromToast: (id: ToastId) => void;
}
