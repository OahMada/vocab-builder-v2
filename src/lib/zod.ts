import { MAX_QUERY_LEN, SENTENCE_FETCHING_LIMIT } from '@/constants';
import * as z from 'zod';
import { INPUT_NAME } from '@/constants';

export var UserInputSchema = z.object({
	[INPUT_NAME.SENTENCE]: z
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

export type UserInputType = z.infer<typeof UserInputSchema>;

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

export var FetchIPAInputSchema = z.object({
	sentence: SentenceSchema.shape.sentence,
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

export var TranslationSchema = z.object({
	[INPUT_NAME.TRANSLATION]: z.string().trim(),
});
export type TranslationType = z.infer<typeof TranslationSchema>;

export var NoteSchema = z.object({
	[INPUT_NAME.NOTE]: z.string().trim().max(500, {
		error: 'The note text should be no longer than 500 characters.',
	}),
});

export type NoteType = z.infer<typeof NoteSchema>;

export var QuestionInputSchema = z.object({
	[INPUT_NAME.QUESTION]: z.string().trim().min(3, {
		error: 'The question text should be at least 3 characters long.',
	}),
});
export type QuestionInputType = z.infer<typeof QuestionInputSchema>;

export var FetchAnswerInputSchema = QuestionInputSchema.extend({ sentence: SentenceSchema.shape.sentence });

var PieceSchema = z.object({
	id: z.cuid2(),
	word: z.string().min(1),
	IPA: z.string().optional(),
});

var PiecesCreateInputSchema = z.union([PieceSchema, z.string()]);

export var SentenceCreateInputSchema = z.object({
	sentence: SentenceSchema.shape.sentence,
	pieces: z.array(PiecesCreateInputSchema),
	translation: TranslationSchema.shape.translation.min(3),
	note: NoteSchema.shape.note.optional(),
	audioBlob: z.instanceof(Blob).refine((blob) => blob.type.startsWith('audio/'), { error: 'Must be an audio Blob.' }),
});

export type SentenceCreateInputType = z.infer<typeof SentenceCreateInputSchema>;

export var IdSchema = z.cuid2();

export var SentenceUpdateInputSchema = z.object({
	id: IdSchema,
	translation: SentenceCreateInputSchema.shape.translation,
	note: SentenceCreateInputSchema.shape.note,
	pieces: z.array(PiecesCreateInputSchema),
});

export type SentenceUpdateInputType = z.infer<typeof SentenceUpdateInputSchema>;

export var UserIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export var CountSearchResultSchema = z.object({
	[INPUT_NAME.SEARCH]: z
		.string()
		.trim()
		.transform((val) => val.slice(0, MAX_QUERY_LEN)),
	userId: UserIdSchema,
});

export var SearchSentencesInputSchema = CountSearchResultSchema.extend({
	cursor: z
		.string()
		.regex(/^[A-Za-z0-9+/=]+$/, 'Invalid search pagination token')
		.optional(),
	limit: z.number().default(SENTENCE_FETCHING_LIMIT),
});

export var ReadSentencesInputSchema = z.object({
	cursor: IdSchema.optional(),
	limit: SearchSentencesInputSchema.shape.limit,
	userId: UserIdSchema,
});

export var CheckSentenceInputSchema = z.object({
	sentence: SentenceSchema.shape.sentence,
	userId: UserIdSchema,
});

export var ReadOneSentenceInputSchema = z.object({
	sentenceId: IdSchema,
	userId: UserIdSchema,
});

export var DeleteSentenceInputSchema = z.object({
	sentenceId: IdSchema,
	audioUrl: z.url({
		protocol: /^https?$/,
		hostname: z.regexes.domain,
	}),
});

export var LoginInputSchema = z.object({
	email: z.email('Invalid email'),
});

export type LoginInputType = z.infer<typeof LoginInputSchema>;
