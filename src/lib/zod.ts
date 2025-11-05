import * as z from 'zod';

import {
	BLOB_CONTAINER_TYPE,
	MAX_QUERY_LEN,
	SENTENCE_FETCHING_LIMIT,
	USER_UPDATE_ACTION,
	INPUT_NAME,
	NATIVE_LANGUAGE,
	LEARNING_LANGUAGE,
	ENGLISH_IPA_FLAVOUR,
} from '@/constants';

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
					error: 'The sentence should be at least 5 characters long',
				})
				.max(300, {
					error: 'The sentence should be no longer than 300 characters',
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
			error: 'The word should be at least 2 characters long',
		})
		.max(50, {
			error: 'The word should be no longer than 50 characters',
		}),
});

export var TranslationSchema = z.object({
	[INPUT_NAME.TRANSLATION]: z.string().trim(),
});
export type TranslationType = z.infer<typeof TranslationSchema>;

export var NoteSchema = z.object({
	[INPUT_NAME.NOTE]: z.string().trim().max(500, {
		error: 'The note text should be no longer than 500 characters',
	}),
});

export type NoteType = z.infer<typeof NoteSchema>;

export var QuestionInputSchema = z.object({
	[INPUT_NAME.QUESTION]: z.string().trim().min(3, {
		error: 'The question text should be at least 3 characters long',
	}),
});
export type QuestionInputType = z.infer<typeof QuestionInputSchema>;

var PieceSchema = z.object({
	id: z.cuid2(),
	word: z.string().min(1),
	IPA: z.string().optional(),
	index: z.number(),
});

var PiecesCreateInputSchema = z.union([PieceSchema, z.string()]);

export var SentenceCreateInputSchema = z.object({
	sentence: SentenceSchema.shape.sentence,
	pieces: z.array(PiecesCreateInputSchema),
	translation: TranslationSchema.shape.translation.min(3),
	note: NoteSchema.shape.note.optional(),
	audioUrl: z.url({
		protocol: /^https?$/,
		// TODO maybe use a specific domain
		hostname: z.regexes.domain,
	}),
});

export var IdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export var SentenceUpdateInputSchema = z.object({
	id: IdSchema,
	translation: SentenceCreateInputSchema.shape.translation,
	note: SentenceCreateInputSchema.shape.note,
	pieces: z.array(PiecesCreateInputSchema),
});

export var CountSearchResultSchema = z.object({
	[INPUT_NAME.SEARCH]: z
		.string()
		.trim()
		.transform((val) => val.slice(0, MAX_QUERY_LEN)),
	userId: IdSchema,
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
	limit: z.number().optional(),
	userId: IdSchema,
});

export var CheckSentenceInputSchema = z.object({
	sentence: SentenceSchema.shape.sentence,
	userId: IdSchema,
});

export var ReadOneSentenceInputSchema = z.object({
	sentenceId: IdSchema,
	userId: IdSchema,
});

export var DeleteSentenceInputSchema = z.object({
	sentenceId: IdSchema,
	audioUrl: z.url({
		protocol: /^https?$/,
		hostname: z.regexes.domain,
	}),
});

export var CallbackSchema = z.string().optional();
var EmailSchema = z.email({ error: 'Invalid email' });

export var LoginInputSchema = z.object({
	email: EmailSchema,
	callback: CallbackSchema,
});

export type LoginInputType = z.infer<typeof LoginInputSchema>;

var UpdateUserSchemaFields = {
	[INPUT_NAME.EMAIL]: EmailSchema,
	[INPUT_NAME.NAME]: z.string().trim().min(1, { error: 'Name should be at least 1 characters long' }).max(50, {
		error: 'Name should be no longer than 50 characters',
	}),
	[INPUT_NAME.LEARNING_LANGUAGE]: z.enum(LEARNING_LANGUAGE),
	[INPUT_NAME.NATIVE_LANGUAGE]: z.enum(NATIVE_LANGUAGE),
	[INPUT_NAME.ENGLISH_IPA_FLAVOUR]: z.enum(ENGLISH_IPA_FLAVOUR),
	image: z.url({
		protocol: /^https?$/,
		// TODO maybe use a specific domain
		hostname: z.regexes.domain,
	}),
};

export var UpdataSessionSchema = z
	.object({
		...UpdateUserSchemaFields,
		[INPUT_NAME.ENGLISH_IPA_FLAVOUR]: z.enum(ENGLISH_IPA_FLAVOUR).nullable(),
		image: UpdateUserSchemaFields.image.nullable(),
	})
	.partial();

export var PersonalizeInputSchema = z.object({
	[INPUT_NAME.NAME]: UpdateUserSchemaFields[INPUT_NAME.NAME].optional(),
	[INPUT_NAME.LEARNING_LANGUAGE]: UpdateUserSchemaFields[INPUT_NAME.LEARNING_LANGUAGE],
	[INPUT_NAME.NATIVE_LANGUAGE]: UpdateUserSchemaFields[INPUT_NAME.NATIVE_LANGUAGE],
	[INPUT_NAME.ENGLISH_IPA_FLAVOUR]: UpdateUserSchemaFields[INPUT_NAME.ENGLISH_IPA_FLAVOUR].optional(),
});

export type PersonalizeInput = z.infer<typeof PersonalizeInputSchema>;

export var UserInfoInputSchema = z.object({
	[INPUT_NAME.NAME]: UpdateUserSchemaFields[INPUT_NAME.NAME],
	[INPUT_NAME.EMAIL]: UpdateUserSchemaFields[INPUT_NAME.EMAIL],
});

export type UserInfoInput = z.infer<typeof UserInfoInputSchema>;

export var UpdateUserImageSchema = z.object({
	image: UpdateUserSchemaFields.image,
	action: z.literal(USER_UPDATE_ACTION.IMAGE),
});

export var UpdateUserInputSchema = z.discriminatedUnion('action', [
	PersonalizeInputSchema.extend({ action: z.literal(USER_UPDATE_ACTION.PERSONALIZE) }),
	UserInfoInputSchema.extend({ action: z.literal(USER_UPDATE_ACTION.USER_INFO) }),
]);

// Basic file schema
export var ImageFileSchema = z
	.instanceof(File)
	.refine((file) => file.size <= 5 * 1024 * 1024, { error: 'File must be ≤ 5MB' })
	.refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), { error: 'Only JPEG, PNG, or WebP allowed' })
	// Optional: filename length
	.refine((file) => file.name.length <= 50, { error: 'Filename must be ≤ 50 characters' })
	// Optional: allowed extensions
	.refine((file) => /\.(jpe?g|png|webp)$/i.test(file.name), { error: 'Filename must have a valid extension (jpg, jpeg, png, webp)' });

export var GetBlobStorageSASTokenInputSchema = z.union([z.literal(BLOB_CONTAINER_TYPE.AUDIO), z.literal(BLOB_CONTAINER_TYPE.IMAGE)]);

export var DeleteUserInputSchema = z.object({
	email: EmailSchema,
});

export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;
