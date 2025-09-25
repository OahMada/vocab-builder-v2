'use server';

import { generateBlobSASQueryParameters, ContainerSASPermissions, SASProtocol, StorageSharedKeyCredential } from '@azure/storage-blob';

import { BLOB_CONTAINER_TYPE } from '@/constants';
import { GetBlobStorageSASTokenInputSchema } from '@/lib';
import { handleZodError } from '@/utils';

export default async function getBlobStorageSASToken(type: unknown) {
	let result = GetBlobStorageSASTokenInputSchema.safeParse(type);

	if (!result.success) {
		let error = handleZodError(result.error);
		throw new Error(error.formErrors[0]);
	}

	let storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
	if (!storageAccountName) throw new Error('Azure Storage account name not found');
	let storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
	if (!storageAccountKey) {
		throw new Error('Azure Storage Connection string not found');
	}

	let containerName: string | undefined;

	if (result.data === BLOB_CONTAINER_TYPE.IMAGE) {
		containerName = process.env.AZURE_STORAGE_IMAGE_CONTAINER_NAME;
	} else if (result.data === BLOB_CONTAINER_TYPE.AUDIO) {
		containerName = process.env.AZURE_STORAGE_AUDIO_CONTAINER_NAME;
	}

	if (!containerName) throw new Error('Azure Storage containerName not found.');
	let sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, storageAccountKey);
	let expiresOn = new Date(new Date().valueOf() + 15 * 60 * 1000); // 15 min
	let sasToken = generateBlobSASQueryParameters(
		{
			containerName,
			permissions: ContainerSASPermissions.parse('wd'), // read + write
			protocol: SASProtocol.Https,
			expiresOn,
			startsOn: new Date(),
		},
		sharedKeyCredential
	).toString();

	return { sasToken, storageAccountName, containerName };
}
