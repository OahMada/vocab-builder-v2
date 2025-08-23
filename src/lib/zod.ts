import * as z from 'zod';

export var UserInputSchema = z.object({
	'user-input': z
		.string()
		.trim()
		.transform((value) => {
			return value.replace(/\s+/g, ' ');
		})
		.pipe(
			z
				.string()
				.min(5, {
					error: 'The sentence should be at least 5 characters long.',
				})
				.max(300, {
					error: 'The sentence should be no longer than 300 characters.',
				})
		),
});

export type UserInput = z.infer<typeof UserInputSchema>;

export var WordSchema = z.object({
	word: z
		.string()
		.trim()
		.min(2, {
			error: 'The word should be at least 2 characters long.',
		})
		.max(50, {
			error: 'The word should be no longer than 50 characters.',
		}),
});

export var SentenceSchema = z.object({
	sentence: z
		.string()
		.trim()
		.min(5, {
			error: 'The sentence should be at least 5 characters long.',
		})
		.max(300, {
			error: 'The sentence should be no longer than 300 characters.',
		}),
});

export var TranslationSchema = z.object({
	translation: z.string().trim(),
});
export type TranslationType = z.infer<typeof TranslationSchema>;

export var NoteSchema = z.object({
	note: z.string().trim().max(500, {
		error: 'The note text should be no longer than 500 characters.',
	}),
});

export type NoteType = z.infer<typeof NoteSchema>;

export var FetchAnswersSchema = z.object({
	question: z.string().trim().min(3, {
		error: 'The question text should be at least 3 characters long.',
	}),
});

export type FetchAnswersType = z.infer<typeof FetchAnswersSchema>;

var WordDataSchema = z.union([
	z.object({
		id: z.cuid2(),
		piece: z.string().min(1),
		IPA: z.string().optional(),
	}),
	z.string(),
]);

export var SentenceDataSchema = z.object({
	sentence: SentenceSchema.shape.sentence,
	words: z.array(WordDataSchema),
	translation: TranslationSchema.shape.translation.min(3),
	note: NoteSchema.shape.note.optional(),
	audioBlob: z.instanceof(Blob).refine((blob) => blob.type.startsWith('audio/'), { error: 'Must be an audio Blob.' }),
});

export type SentenceDataType = z.infer<typeof SentenceDataSchema>;
