import { updateLocalDB } from './updateLocalDB';
import { updateLocalStorage } from '@/helpers/updateLocalStorage';

export async function deleteLocalData(includeSentence: boolean = false) {
	if (includeSentence) {
		updateLocalStorage('delete', 'user-input');
	}
	updateLocalStorage('delete', 'translation');
	updateLocalStorage('delete', 'words');
	updateLocalStorage('delete', 'note');

	await updateLocalDB('delete');
}
