'use server';

import pLimit from 'p-limit';

import { readAllSentences } from '../sentence/readAllSentences';
import updateSyncDate from '../user/updateSyncDate';

import verifySession from '@/lib/dal';
import invoke from '@/lib/invokeAnkiConnect';
import { SentenceWithPieces } from '@/lib';
import getBlobNameFromUrl from '@/helpers/getBlobNamaFromUrl';
import { wrapIPAWithSlashes } from '@/helpers';

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
	audio?: {
		url: string;
		filename: string;
		fields: string[];
	}[];
}

export default async function syncWithAnki(): Promise<{ error: string } | { data: string }> {
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
		return {
			error: 'AnkiConnect is not set up. Please make sure the AnkiConnect add-on is installed in Anki and that the Anki desktop app is running',
		};
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
		let sentenceNote = item.note ?? '';
		if (!note) {
			let audioFileName = getBlobNameFromUrl(item.audioUrl);
			let noteParam = {
				deckName,
				modelName,
				fields: {
					Sentence: item.sentence,
					Translation: item.translation,
					Note: sentenceNote,
					dbID: item.id,
					IPA: IPAFieldValue,
					Audio: '',
				},
				// to deal with dummy data in database
				...(audioFileName.endsWith('.mp3') && { audio: [{ url: item.audioUrl, filename: audioFileName, fields: ['Audio'] }] }),
			};
			toAdd.push(noteParam);
		} else {
			let fieldsToUpdate: UpdateFieldsParam['fields'] = {};
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

	let returnMessage = [];

	if (toAdd.length > 0) {
		returnMessage.push(`${toAdd.length} ${toAdd.length > 1 ? 'notes' : 'note'} added.`);
	}
	if (toUpdate.length > 0) {
		returnMessage.push(`${toUpdate.length} ${toUpdate.length > 1 ? 'notes' : 'note'} updated.`);
	}
	if (toDelete.length > 0) {
		returnMessage.push(`${toDelete.length} ${toDelete.length > 1 ? 'notes' : 'note'} deleted.`);
	}

	try {
		await updateSyncDate(userId);
	} catch (error) {
		console.error('update sync date failed', error);
		return {
			error: `Synced to Anki successfully${returnMessage.length > 0 ? `: ${returnMessage.join(' ')}` : '.'} but failed to update last synced date`,
		};
	}

	return { data: returnMessage.join(' ') };
}

function createIPAFieldValue(data: SentenceWithPieces['pieces']) {
	if (data.length > 0) {
		let piecesList = data
			.map((p) => {
				let IPA = wrapIPAWithSlashes(p.IPA);
				return `<li>${p.word}: ${IPA}</li>`;
			})
			.join('');
		return `<ul>${piecesList}</ul>`;
	} else {
		return '';
	}
}
