import { TOAST_ID } from '@/constants';
import { Subscription } from '@/lib';

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

export type Theme = 'light' | 'dark';

export interface SentenceDataType {
	translation: string;
	pieces: PiecesType;
	note?: string | undefined;
}

export interface ScheduledChange {
	action: 'cancel' | 'pause' | 'resume';
	effectiveAt: string;
	resumeAt: string | undefined;
}

export type SubscriptionDetail = Omit<Subscription, 'nextBillingAt' | 'scheduledChange'> & {
	nextBillingAt: string | undefined;
	scheduledChange: ScheduledChange | undefined;
};

export interface TrialStatus {
	status: 'expired' | 'active';
	expireDate: string;
}
