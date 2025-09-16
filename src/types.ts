import { TOAST_ID } from '@/constants';

export type Piece =
	| {
			id: string;
			word: string;
			IPA?: string;
	  }
	| string;

export type PiecesType = Piece[];

type IPAId = `IPA_${string}`;
type AudioPlayingWithUrl = `audio_playing_${string}`;

export type ToastId = Exclude<(typeof TOAST_ID)[keyof typeof TOAST_ID], 'IPA_' | 'audio_playing_'> | IPAId | AudioPlayingWithUrl;
