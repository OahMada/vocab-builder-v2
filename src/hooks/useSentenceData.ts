import { SentenceCreateInputType, SentenceUpdateInputType } from '@/lib';

import { useTranslationContext } from '@/components/TranslationProvider';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import { useNoteContext } from '@/components/NoteProvider';
import { useAudioDataContext } from '@/components/AudioDataProvider';

type SentenceData =
	| (Omit<SentenceCreateInputType, 'sentence' | 'audioUrl'> & {
			audioBlob: Blob;
	  })
	| Omit<SentenceUpdateInputType, 'id'>;
type UseSentenceDataReturnType = [boolean, SentenceData];

export function useSentenceData(): UseSentenceDataReturnType {
	let { isLocalDataLoading: translationLoading, translation, isEditing: isTranslationEditing } = useTranslationContext();
	let translationReady = !translationLoading && translation && !isTranslationEditing;
	let { pieces } = useSentencePiecesContext();
	let { isLocalDataLoading: noteLoading, note, isEditing: isNoteEditing } = useNoteContext();
	let noteReady = !noteLoading && !isNoteEditing;
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
