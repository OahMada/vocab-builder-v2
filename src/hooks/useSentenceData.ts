import { useTranslationContext } from '@/components/TranslationProvider';
import { useWordsContext } from '@/components/WordsProvider';
import { useNoteContext } from '@/components/NoteProvider';
import { useAudioBlobContext } from '@/components/AudioBlobProvider';
import { SentenceDataType } from '@/lib';

export function useSentenceData(): [boolean, Omit<SentenceDataType, 'sentence'>] {
	let { isLocalDataLoading: translationLoading, translation } = useTranslationContext();
	let translationReady = !translationLoading && translation;
	let { words } = useWordsContext();
	let { isLocalDataLoading: noteLoading, note } = useNoteContext();
	let noteReady = !noteLoading;
	let { isLocalDataLoading: audioBlobLoading, audioBlob } = useAudioBlobContext();
	let audioBlobReady = !audioBlobLoading && audioBlob;
	let sentenceDataReady = Boolean(translationReady && words && noteReady && audioBlobReady);

	let sentenceData = {
		translation: translation!,
		note,
		audioBlob: audioBlob!,
		words,
	};

	return [sentenceDataReady, sentenceData];
}
