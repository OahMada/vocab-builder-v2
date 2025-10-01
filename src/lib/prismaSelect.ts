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
			index: true,
		},
	},
} satisfies Prisma.SentenceSelect;

export type SentenceWithPieces = Prisma.SentenceGetPayload<{ select: typeof sentenceReadSelect }>;

export var userSelect = {
	name: true,
	email: true,
	EnglishIPAFlavour: true,
	image: true,
	learningLanguage: true,
	nativeLanguage: true,
} satisfies Prisma.UserSelect;

export type User = Prisma.UserGetPayload<{ select: typeof userSelect }>;
