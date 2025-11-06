import { SentenceDataType } from '@/types';

import { useTranslationContext } from '@/components/TranslationProvider';
import { useSentencePiecesContext } from '@/components/SentencePiecesProvider';
import { useNoteContext } from '@/components/NoteProvider';
import { useAudioDataContext } from '@/components/AudioDataProvider';

type SentenceData =
	| (SentenceDataType & {
			audioBlob: Blob;
	  })
	| SentenceDataType;
type UseSentenceDataReturnType = [boolean, SentenceData];

export function useSentenceData(): UseSentenceDataReturnType {
	let { translation, isEditing: isTranslationEditing } = useTranslationContext();
	let translationReady = translation && !isTranslationEditing;
	let { pieces } = useSentencePiecesContext();
	let { note, isEditing: isNoteEditing } = useNoteContext();
	let noteReady = !isNoteEditing;
	let { audioBlob, audioUrl } = useAudioDataContext();
	let audioBlobReady = audioBlob || audioUrl;
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
