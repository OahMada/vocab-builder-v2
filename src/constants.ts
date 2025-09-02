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
	NOTE: 'note',
	SENTENCE_CREATION: 'sentence_creation',
	SENTENCE: 'sentence',
	SENTENCE_DELETION: 'sentence_deletion',
	TRANSLATION_EDITING: 'translation_editing',
	TRANSLATION_FETCHING: 'translation_fetching',
	IPA_FETCHING: 'IPA_',
	AUDIO_PLAYING: 'audio_playing',
	SENTENCE_UPDATING: 'sentence_updating',
} as const;

export const INPUT_NAME = {
	SENTENCE: 'sentence',
	TRANSLATION: 'translation',
	NOTE: 'note',
	QUESTION: 'question',
} as const;

export const LOCAL_STORAGE_KEY = {
	NOTE: INPUT_NAME.NOTE,
	SENTENCE: INPUT_NAME.SENTENCE,
	PIECES: 'pieces',
	TRANSLATION: INPUT_NAME.TRANSLATION,
} as const;

export const LOCAL_STORAGE_OBJ = 'vocab-builder';

export const COOKIE_KEY = 'sentence';

export const LOCAL_DB_KEY = 'audio';

// export const LANGUAGE_OPTIONS =

export const UNSTABLE_CACHE_TAG = 'sentences';
