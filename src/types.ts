import { TOAST_ID } from '@/constants';

export type Piece =
	| {
			id: string;
			word: string;
			IPA?: string;
			index: number;
	  }
	| string;

export type PiecesType = Piece[];

export type PieceWithSearchMatch = (Extract<Piece, { id: string }> & { isSearchMatch?: boolean }) | string;

type IPAId = `IPA_${string}`;
type AudioPlayingWithUrl = `audio_playing_${string}`;

export type ToastId = Exclude<(typeof TOAST_ID)[keyof typeof TOAST_ID], 'IPA_' | 'audio_playing_'> | IPAId | AudioPlayingWithUrl;
