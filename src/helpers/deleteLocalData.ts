import { updateLocalDB } from './updateLocalDB';

export function deleteLocalData() {
	window.localStorage.removeItem('vocab-builder');
	updateLocalDB('delete');
}
