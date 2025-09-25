import { set, del } from 'idb-keyval';

import { LOCAL_DB_KEY } from '@/constants';

export async function updateLocalDB(action: 'set', val: Blob): Promise<void>;
export async function updateLocalDB(action: 'delete'): Promise<void>;
export async function updateLocalDB(action: 'set' | 'delete', val?: Blob): Promise<void> {
	try {
		switch (action) {
			case 'set':
				await set(LOCAL_DB_KEY, val);
				break;
			case 'delete':
				await del(LOCAL_DB_KEY);
				break;
		}
	} catch (error) {
		throw error;
	}
}
