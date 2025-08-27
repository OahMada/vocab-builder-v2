import { Prisma } from '@prisma/client';

export var sentenceReadSelect = {
	id: true,
	note: true,
	sentence: true,
	translation: true,
	audioUrl: true,
	pieces: {
		select: {
			id: true,
			IPA: true,
			word: true,
		},
	},
} satisfies Prisma.SentenceSelect;

export type SentenceWithPieces = Prisma.SentenceGetPayload<{ select: typeof sentenceReadSelect }>;
