import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_OBJ } from '@/constants';
import { updateLocalDB } from './updateLocalDB';
import { updateLocalStorage } from '@/helpers/updateLocalStorage';

export async function deleteLocalData(includeSentence: boolean = false) {
	if (!includeSentence) {
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.TRANSLATION);
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.PIECES);
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.NOTE);
	} else {
		window.localStorage.removeItem(LOCAL_STORAGE_OBJ);
	}

	await updateLocalDB('delete');
}
