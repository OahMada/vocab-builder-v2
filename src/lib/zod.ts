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
					error: 'The sentence should be no longer than 500 characters.',
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

export var SentenceToTranslateSchema = z.object({
	sentence: z
		.string()
		.trim()
		.min(5, {
			error: 'The sentence should be at least 5 characters long.',
		})
		.max(300, {
			error: 'The sentence should be no longer than 500 characters.',
		}),
});

export var TranslationTextSchema = z.object({
	'translation-text': z.string().trim().min(1, { error: 'The translation text should be at least 1 character long.' }),
});
export type TranslationText = z.infer<typeof TranslationTextSchema>;
