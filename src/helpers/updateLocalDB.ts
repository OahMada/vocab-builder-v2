import { set, del } from 'idb-keyval';

export async function updateLocalDB(action: 'set', val: Blob): Promise<void>;
export async function updateLocalDB(action: 'delete'): Promise<void>;
export async function updateLocalDB(action: 'set' | 'delete', val?: Blob): Promise<void> {
	try {
		switch (action) {
			case 'set':
				await set('audio', val);
				break;
			case 'delete':
				await del('audio');
				break;
		}
	} catch (error) {
		throw error;
	}
}
