export const ENGLISH_IPA = [
	// Consonants
	'p',
	'b',
	't',
	'd',
	'k',
	'ɡ',
	'm',
	'n',
	'ŋ',
	'f',
	'v',
	'θ',
	'ð',
	's',
	'z',
	'ʃ',
	'ʒ',
	'h',
	'tʃ',
	'dʒ',
	'r',
	'j',
	'w',
	'l',

	// Monophthong vowels
	'iː',
	'ɪ',
	'e',
	'æ',
	'ɑː',
	'ɒ',
	'ɔː',
	'ʊ',
	'uː',
	'ʌ',
	'ɜː',
	'ə',

	// Diphthongs
	'eɪ',
	'aɪ',
	'ɔɪ',
	'aʊ',
	'əʊ',
	'oʊ',
	'ɪə',
	'eə',
	'ʊə',
];
export const TOAST_ID = {
	SENTENCE_CREATION: 'sentence_creation',
	SENTENCE: 'sentence',
	SENTENCE_DELETION: 'sentence_deletion',
	TRANSLATION_FETCHING: 'translation_fetching',
	IPA_FETCHING: 'IPA_',
	AUDIO_PLAYING: 'audio_playing_',
	SENTENCE_UPDATING: 'sentence_updating',
	SENTENCE_FETCHING: 'sentence_fetching',
	LOGIN: 'login',
	USER_UPDATE: 'user_update',
	ACCOUNT_LINK: 'account_link',
	IMAGE_UPLOAD: 'image_upload',
	AUDIO_UPLOAD: 'audio_upload',
	SAS_TOKEN: 'sas_token',
	EXPORT_DATA: 'export_data',
	DELETE_USER: 'delete_user',
} as const;

export const INPUT_NAME = {
	SENTENCE: 'sentence',
	TRANSLATION: 'translation',
	NOTE: 'note',
	QUESTION: 'question',
	SEARCH: 'search',
	EMAIL: 'email',
	NAME: 'name',
	LEARNING_LANGUAGE: 'learningLanguage',
	NATIVE_LANGUAGE: 'nativeLanguage',
	ENGLISH_IPA_FLAVOUR: 'EnglishIPAFlavour',
} as const;

export const LOCAL_STORAGE_KEY = {
	NOTE: INPUT_NAME.NOTE,
	SENTENCE: INPUT_NAME.SENTENCE,
	PIECES: 'pieces',
	TRANSLATION: INPUT_NAME.TRANSLATION,
} as const;

export const LOCAL_STORAGE_OBJ = 'vocab_builder';

export const COOKIE_KEY = 'sentence';

export const LOCAL_DB_KEY = 'audio';

export const UNSTABLE_CACHE_TAG = {
	SENTENCES: 'sentences',
} as const;

export const SENTENCE_FETCHING_LIMIT = 15;
export const MAX_QUERY_LEN = 50;
export const API_ABORT_TIMEOUT = 15000;
export const EMAIL_FROM = 'no-reply@vocab-builder.app';

export const LEARNING_LANGUAGE = ['English', 'French', 'Spanish', 'German'] as const;
export const NATIVE_LANGUAGE = [...LEARNING_LANGUAGE, 'Chinese'] as const;
export const ENGLISH_IPA_FLAVOUR = ['UK', 'US'] as const;

export const USER_UPDATE_ACTION = {
	PERSONALIZE: 'personalize',
	USER_INFO: 'user_info',
	IMAGE: 'image',
} as const;

export const BLOB_CONTAINER_TYPE = {
	IMAGE: 'image',
	AUDIO: 'audio',
} as const;

export const TTS_SPEECH_VOICE: Record<(typeof LEARNING_LANGUAGE)[number], string> = {
	English: 'en-US-AriaNeural',
	French: 'fr-FR-DeniseNeural',
	German: 'de-DE-ElkeNeural',
	Spanish: 'es-ES-ElviraNeural',
};
