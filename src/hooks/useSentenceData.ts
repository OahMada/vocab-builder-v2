import { useTranslationContext } from '@/components/TranslationProvider';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import { useNoteContext } from '@/components/NoteProvider';
import { useAudioDataContext } from '@/components/AudioDataProvider';
import { SentenceCreateInputType, SentenceUpdateInputType } from '@/lib';

type SentenceData = Omit<SentenceCreateInputType, 'sentence'> | Omit<SentenceUpdateInputType, 'id'>;
type UseSentenceDataReturnType = [boolean, SentenceData];

export function useSentenceData(): UseSentenceDataReturnType {
	let { isLocalDataLoading: translationLoading, translation } = useTranslationContext();
	let translationReady = !translationLoading && translation;
	let { pieces } = useSentencePiecesContext();
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
