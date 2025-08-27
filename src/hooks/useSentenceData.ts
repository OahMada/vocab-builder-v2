import { useTranslationContext } from '@/components/TranslationProvider';
import { useWordsContext } from '@/components/WordsProvider';
import { useNoteContext } from '@/components/NoteProvider';
import { useAudioDataContext } from '@/components/AudioDataProvider';
import { SentenceDataType } from '@/lib';

type SentenceData = Omit<SentenceDataType, 'sentence'> | Omit<SentenceDataType, 'sentence' | 'audioBlob'>;
type UseSentenceDataReturnType = [boolean, SentenceData];

export function useSentenceData(): UseSentenceDataReturnType {
	let { isLocalDataLoading: translationLoading, translation } = useTranslationContext();
	let translationReady = !translationLoading && translation;
	let { pieces } = useWordsContext();
	let { isLocalDataLoading: noteLoading, note } = useNoteContext();
	let noteReady = !noteLoading;
	let { isLocalDataLoading: audioBlobLoading, audioBlob, audioUrl } = useAudioDataContext();
	let audioBlobReady = !audioBlobLoading && (audioBlob || audioUrl);
	let sentenceDataReady = Boolean(translationReady && pieces && noteReady && audioBlobReady);

	let sentenceData: SentenceData;

	if (audioBlob) {
		sentenceData = {
			translation: translation!,
			note,
			audioBlob,
			pieces,
		};
	} else {
		sentenceData = {
			translation: translation!,
			note,
			pieces,
		};
	}

	return [sentenceDataReady, sentenceData];
}
