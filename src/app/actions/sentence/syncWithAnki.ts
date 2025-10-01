'use server';

import pLimit from 'p-limit';

import { readAllSentences } from './readAllSentences';

import verifySession from '@/lib/dal';
import invoke from '@/lib/invokeAnkiConnect';
import { SentenceWithPieces } from '@/lib';
import getBlobNameFromUrl from '@/helpers/getBlobNamaFromUrl';

interface UpdateFieldsParam {
	id: number;
	fields: Record<string, string>;
}

interface AddNoteParam {
	deckName: string;
	modelName: string;
	fields: {
		Sentence: string;
		Translation: string;
		Note: string;
		dbID: string;
		IPA: string;
		Audio: string;
	};
	audio: {
		url: string;
		filename: string;
		fields: string[];
	}[];
}

export default async function syncWithAnki(): Promise<{ error: string } | undefined> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	let userName = session.name;
	let userId = session.id;

	let deckName = `Vocab Builder - ${userName}`;
	let modelName = 'Custom: Vocab Builder';

	try {
		await invoke('version');
	} catch (error) {
		console.error(error);
		return { error: 'AnkiConnect is not set up. Please make sure that AnkiConnect is installed in Anki and that the Anki desktop app is running' };
	}

	try {
		let result = await invoke('deckNames');

		// setup
		if (!result.includes(deckName)) {
			await invoke('createDeck', {
				deck: deckName,
			});

			await invoke('createModel', {
				modelName: modelName,
				inOrderFields: ['Sentence', 'Audio', 'IPA', 'Translation', 'Note', 'dbID'],
				css: 'Optional CSS with default to builtin css',
				isCloze: false,
				cardTemplates: [
					{
						Name: 'Basic',
						Front: '{{Sentence}} {{Audio}}<br/>{{IPA}}',
						Back: "{{FrontSide}}<hr id='answer'>{{Translation}}<br/><div class='note-field'>{{Note}}</div>",
					},
					{
						Name: 'Reverse',
						Front: '{{Translation}}',
						Back: "{{FrontSide}}<hr id='answer'>{{Sentence}} {{Audio}}<br/>{{IPA}}<br/><div class='note-field'>{{Note}}</div>",
					},
					{
						Name: 'Type',
						Front: '{{type:Sentence}} {{Audio}}',
						Back: "{{FrontSide}}<hr id='answer'>{{IPA}}<br/>{{Translation}}<br/><div class='note-field'>{{Note}}</div>",
					},
				],
			});
		}
	} catch (error) {
		console.error('Failed to setup Anki deck:', error);
		return { error: 'Failed to setup Anki deck' };
	}

	// read user data
	let readResult = await readAllSentences({ userId });
	if ('error' in readResult) {
		console.error('read all sentence data action failed: ', readResult.error);
		return { error: 'Failed to fetch account data' };
	}
	let userData = readResult.data;

	// read deck data
	let existingNotes = [];
	try {
		existingNotes = await invoke('notesInfo', { query: `deck:\"${deckName}\"` });
	} catch (error) {
		console.error('fetching notes data failed', error);
		return { error: `Failed to fetch notes data in deck ${deckName}}` };
	}
	let existingNotesMap = new Map();
	for (let note of existingNotes) {
		if (note.fields.dbID?.value) {
			existingNotesMap.set(note.fields.dbID.value, note);
		}
	}

	// prepare for actions
	let toAdd: AddNoteParam[] = [];
	let toUpdate: UpdateFieldsParam[] = [];
	let toDelete: number[] = [];

	for (let item of userData) {
		let note = existingNotesMap.get(item.id);
		let IPAFieldValue = createIPAFieldValue(item.pieces);
		if (!note) {
			let audioFileName = getBlobNameFromUrl(item.audioUrl);
			let noteParam = {
				deckName,
				modelName,
				fields: {
					Sentence: item.sentence,
					Translation: item.translation,
					Note: item.note ?? '',
					dbID: item.id,
					IPA: createIPAFieldValue(item.pieces),
					Audio: '',
				},
				audio: [{ url: item.audioUrl, filename: audioFileName, fields: ['Audio'] }],
			};
			toAdd.push(noteParam);
		} else {
			let fieldsToUpdate: UpdateFieldsParam['fields'] = {};
			let sentenceNote = item.note ?? '';

			if (note.fields.Translation.value !== item.translation) fieldsToUpdate['Translation'] = item.translation;
			if (note.fields.Note.value !== sentenceNote) fieldsToUpdate['Note'] = sentenceNote;
			if (note.fields.IPA.value !== IPAFieldValue) fieldsToUpdate['IPA'] = IPAFieldValue;

			if (Object.keys(fieldsToUpdate).length > 0) {
				toUpdate.push({ id: note.noteId, fields: fieldsToUpdate });
			}
		}
	}

	for (let note of existingNotes) {
		if (!userData.find((item) => item.id === note.fields.dbID?.value)) {
			toDelete.push(note.noteId);
		}
	}

	console.log('changes to be made', toAdd, toDelete, toUpdate);

	// create/update/delete notes
	let batchSize = 100;
	let limit = pLimit(10);
	try {
		for (let i = 0; i < toAdd.length; i += batchSize) {
			let batch = toAdd.slice(i, i + batchSize);
			await invoke('addNotes', { notes: batch });
		}
	} catch (error) {
		console.error('AddNote action failed.', error);
		return { error: 'Failed to add new notes to Anki' };
	}

	try {
		for (let i = 0; i < toUpdate.length; i += batchSize) {
			let batch = toUpdate.slice(i, i + batchSize);
			await limit.map(batch, (item) => invoke('updateNoteFields', { note: item }));
		}
	} catch (error) {
		console.error('UpdateNoteFields action failed.', error);
		return { error: 'Failed to update existing notes in Anki' };
	}

	try {
		for (let i = 0; i < toDelete.length; i += batchSize) {
			let batch = toDelete.slice(i, i + batchSize);
			await invoke('deleteNotes', { notes: batch });
		}
	} catch (error) {
		console.error('deleteNotes action failed.', error);
		return { error: 'Failed to delete obsolete notes' };
	}
}

function createIPAFieldValue(data: SentenceWithPieces['pieces']) {
	let piecesList = data.map((p) => `<li>${p.word}: ${p.IPA}</li>`).join('');
	return data.length > 0 ? `<ul>${piecesList}</ul>` : '';
}
