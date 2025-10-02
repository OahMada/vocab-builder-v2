'use server';

import pLimit from 'p-limit';
import path from 'path';

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

var css = `
@font-face {
  font-family: "Roboto";
  src: url("_Roboto.woff2") format("woff2");
  font-style: normal;
}

*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

p {
  text-wrap: pretty;
}

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

html, body {
	height: 100%;
}


.card {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
	padding: 30px 20px;
	margin: 0;
	text-align: start;
}

.replay-button svg {
  width: 30px;
  height: 30px;
}

.sentence {
	font-weight: 500;
	margin-bottom: 10px;
}

.ipa {
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	padding: 0;
	margin-bottom: 10px;
	margin-top: 10px;
}

.ipa li {
	border: 1px solid black;
	border-radius: 10px;
	padding: 5px;
	font-size: 14px;
}

body.nightMode .ipa li {
	border: 1px solid lightgrey;
}


.ipa:empty {
	display: none;
}

.audio {
	position: fixed;
	left: 20px;
	bottom: 20px;
	filter: drop-shadow(0px 4px 4px hsla(0, 0%, 0%, 0.3));
}

.translation {
	margin-bottom: 10px;
}

.note {
	white-space: pre-wrap;
	background-color: lightgrey;
	border-radius: 10px;
	padding: 8px;
}

body.nightMode .note {
	background-color: hsl(0, 0%, 12%);
}


.note:empty {
  display: none;
}

.input {
	margin-bottom: 10px;
}
`;

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
				css,
				isCloze: false,
				cardTemplates: [
					{
						Name: 'Basic',
						Front: '<p class="sentence">{{Sentence}}</p><ul class="ipa">{{IPA}}</ul><div class="audio">{{Audio}}</div>',
						Back: '{{FrontSide}}<hr id="answer"><p class="translation">{{Translation}}</p><p class="note">{{Note}}</p>',
					},
					{
						Name: 'Reverse',
						Front: '<p class="translation">{{Translation}}</p>',
						Back: '{{FrontSide}}<hr id="answer"><p class="sentence">{{Sentence}}</p><ul class="ipa">{{IPA}}</ul><p class="note">{{Note}}</p><div class="audio">{{Audio}}</div>',
					},
					{
						Name: 'Type',
						Front: '<div class="input">{{type:Sentence}}</div><p class="translation">{{Translation}}</p><div class="audio">{{Audio}}</div>',
						Back: '{{FrontSide}}<hr id="answer"><ul class="ipa">{{IPA}}</ul><p class="note">{{Note}}</p>',
					},
				],
			});

			let fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto.woff2');
			await invoke('storeMediaFile', { filename: '_Roboto.woff2', path: fontPath });
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
		return piecesList;
	} else {
		return '';
	}
}
