import { sendToBackgroundViaRelay } from '@plasmohq/messaging';

export async function postMessage(data: string): Promise<{ syncing: boolean } | undefined> {
	return Promise.race([
		sendToBackgroundViaRelay<string, { syncing: boolean }>({
			name: 'sync',
			body: data,
		}),
		new Promise<undefined>((resolve) => window.setTimeout(() => resolve(undefined), 5000)),
	]);
}
