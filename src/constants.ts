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
	LAST_EXPORTED: 'last_exported',
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

export const BREAKPOINTS = {
	tabletMin: 550,
	laptopMin: 1100,
	desktopMin: 1500,
};

export const QUERIES = {
	tabletAndUp: `(min-width: ${BREAKPOINTS.tabletMin / 16}rem)`,
	laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin / 16}rem)`,
	desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin / 16}rem)`,
};

export const LIGHT_COLORS = {
	'--bg-overlay': 'hsl(0 0% 0% / 30%)',
	'--bg-transparent': 'hsl(0 0% 98% / 0.5)',
	'--bg-modal': 'hsl(0 0% 100%)',
	'--bg-popover': 'hsl(0 0% 94%)',
	'--bg-dropdown': 'hsl(0 0% 97%)',
	'--bg-dropdown-highlight': 'hsl(0 0% 93%)',
	'--bg-primary': 'hsl(0 0% 100%)',
	'--bg-primary-hover': 'hsl(0 0% 98%)',
	'--bg-secondary': 'hsl(0 0% 97%)',
	'--bg-secondary-hover': 'hsl(0 0% 95%)',
	'--bg-tertiary': 'hsl(0 0% 93%)',
	'--bg-tertiary-hover': 'hsl(0 0% 88%)',
	'--bg-revert': 'hsl(0 0% 5%)',
	'--bg-revert-hover': 'hsl(0 0% 13%)',
	'--border': 'hsl(0 0% 0% / 15%)',
	'--text-primary': 'hsl(0 0%  5%)',
	'--text-secondary': 'hsl(0 0% 20%)',
	'--text-tertiary': 'hsl(0 0% 36%)',
	'--text-revert': 'hsl(0 0% 100%)',
	'--text-status-warning': 'hsl(20 100% 40%)',
	'--text-status-mark': 'hsl(54 100% 35%)',
	// https://www.joshwcomeau.com/gradient-generator/ linear, 90deg, three color at 0%, 50%, 100%
	'--loading-background-image': `linear-gradient(
    90deg,
    hsl(0 0% 90%) 0%,
    hsl(344 0% 88%) 8%,
    hsl(344 0% 87%) 17%,
    hsl(344 0% 85%) 25%,
    hsl(344 0% 83%) 33%,
    hsl(344 0% 82%) 42%,
    hsl(0 0% 80%) 50%,
    hsl(344 0% 82%) 58%,
    hsl(344 0% 83%) 67%,
    hsl(344 0% 85%) 75%,
    hsl(344 0% 87%) 83%,
    hsl(344 0% 88%) 92%,
    hsl(0 0% 90%) 100%
  )`,

	// https://www.joshwcomeau.com/shadow-palette/ top middle light, 0.1 Oomph, 0.7 crispy, hsl(0, 0% 100%);
	'--shadow-color': '0deg 0% 77%',
	'--shadow-elevation-low': `0px 1px 1px hsl(var(--shadow-color) / 0.28),
    0px 1.4px 1.4px -1.7px hsl(var(--shadow-color) / 0.23),
    0px 3.2px 3.1px -3.5px hsl(var(--shadow-color) / 0.18)`,
	'--shadow-elevation-medium': `0px 1px 1px hsl(var(--shadow-color) / 0.3),
    0px 2.3px 2.2px -1.2px hsl(var(--shadow-color) / 0.25),
    0px 6.2px 6px -2.3px hsl(var(--shadow-color) / 0.21),
    -0.1px 16px 15.6px -3.5px hsl(var(--shadow-color) / 0.17)`,
	'--shadow-elevation-high': `0px 1px 1px hsl(var(--shadow-color) / 0.32),
    0px 3.1px 3px -0.6px hsl(var(--shadow-color) / 0.29),
    0px 6.1px 5.9px -1.2px hsl(var(--shadow-color) / 0.26),
    -0.1px 11.7px 11.4px -1.7px hsl(var(--shadow-color) / 0.24),
    -0.1px 21.4px 20.9px -2.3px hsl(var(--shadow-color) / 0.21),
    -0.2px 37px 36.1px -2.9px hsl(var(--shadow-color) / 0.19),
    -0.3px 60px 58.5px -3.5px hsl(var(--shadow-color) / 0.16)`,
};

export const DARK_COLORS = {
	'--bg-overlay': 'hsl(0 0% 0% / 93%)',
	'--bg-transparent': 'hsl(0 0% 0% / 0.5)',
	'--bg-modal': 'hsl(0 0% 9%)',
	'--bg-popover': 'hsl(0 0% 16%)',
	'--bg-dropdown': 'hsl(0 0% 10%)',
	'--bg-dropdown-highlight': 'hsl(0 0% 15%)',
	'--bg-primary': 'hsl(0 0% 0%)',
	'--bg-primary-hover': 'hsl(0 0% 5%)',
	'--bg-secondary': 'hsl(0 0% 12%)',
	'--bg-secondary-hover': 'hsl(0 0% 17%)',
	'--bg-tertiary': 'hsl(0 0% 20%)',
	'--bg-tertiary-hover': 'hsl(0, 0%, 25%)',
	'--bg-revert': 'hsl(0 0% 98%)',
	'--bg-revert-hover': 'hsl(0 0% 93%)',
	'--border': 'hsl(0 0% 100% / 15%)',
	'--text-primary': 'hsl(0 0% 100%)',
	'--text-secondary': 'hsl(0 0% 80%)',
	'--text-tertiary': 'hsl(0 0% 56%)',
	'--text-revert': 'hsl(0 0% 5%)',
	'--text-status-warning': 'hsl(20 100% 70%)',
	'--text-status-mark': 'hsl(54 100% 70%)',
	// https://www.joshwcomeau.com/gradient-generator/ linear, 90deg, three color at 0%, 50%, 100%
	'--loading-background-image': `linear-gradient(
      90deg,
      hsl(0 0% 20%) 0%,
      hsl(344 0% 22%) 8%,
      hsl(344 0% 23%) 17%,
      hsl(344 0% 25%) 25%,
      hsl(344 0% 27%) 33%,
      hsl(344 0% 28%) 42%,
      hsl(0 0% 30%) 50%,
      hsl(344 0% 28%) 58%,
      hsl(344 0% 27%) 67%,
      hsl(344 0% 25%) 75%,
      hsl(344 0% 23%) 83%,
      hsl(344 0% 22%) 92%,
      hsl(0 0% 20%) 100%
    )`,

	// https://www.joshwcomeau.com/shadow-palette/ top middle light, 0.1 Oomph, 0.7 crispy, hsl(0, 0% 0%);
	'--shadow-color': '0deg 0% 0%',
	'--shadow-elevation-low': `0px 1px 1px hsl(var(--shadow-color) / 0.28),
    0px 1.4px 1.4px -1.7px hsl(var(--shadow-color) / 0.23),
    0px 3.2px 3.1px -3.5px hsl(var(--shadow-color) / 0.18)`,
	'--shadow-elevation-medium': `0px 1px 1px hsl(var(--shadow-color) / 0.3),
    0px 2.3px 2.2px -1.2px hsl(var(--shadow-color) / 0.25),
    0px 6.2px 6px -2.3px hsl(var(--shadow-color) / 0.21),
    -0.1px 16px 15.6px -3.5px hsl(var(--shadow-color) / 0.17)`,
	'--shadow-elevation-high': ` 0px 1px 1px hsl(var(--shadow-color) / 0.28),
    0px 2.8px 2.7px -0.5px hsl(var(--shadow-color) / 0.26),
    0px 5.1px 5px -1px hsl(var(--shadow-color) / 0.24),
    0px 8.9px 8.7px -1.5px hsl(var(--shadow-color) / 0.22),
    -0.1px 15.3px 14.9px -2px hsl(var(--shadow-color) / 0.2),
    -0.1px 25.2px 24.6px -2.5px hsl(var(--shadow-color) / 0.18),
    -0.2px 39.8px 38.8px -3px hsl(var(--shadow-color) / 0.16),
    -0.3px 60px 58.5px -3.5px hsl(var(--shadow-color) / 0.14)`,
};
