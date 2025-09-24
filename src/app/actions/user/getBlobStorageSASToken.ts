'use server';

import { generateBlobSASQueryParameters, ContainerSASPermissions, SASProtocol, StorageSharedKeyCredential } from '@azure/storage-blob';

export default async function getBlobStorageSASToken() {
	let storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
	if (!storageAccountName) throw new Error('Azure Storage account name not found');
	let storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
	if (!storageAccountKey) {
		throw Error('Azure Storage Connection string not found');
	}
	let containerName = process.env.AZURE_STORAGE_IMAGE_CONTAINER_NAME;
	if (!containerName) throw new Error('Azure Storage containerName not found.');

	let sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
	let expiresOn = new Date(new Date().valueOf() + 15 * 60 * 1000); // 15 min
	let sasToken = generateBlobSASQueryParameters(
		{
			containerName,
			permissions: ContainerSASPermissions.parse('w'), // read + write
			protocol: SASProtocol.Https,
			expiresOn,
			startsOn: new Date(),
		},
		sharedKeyCredential
	).toString();

	return { sasToken, storageAccountName, containerName };
}
