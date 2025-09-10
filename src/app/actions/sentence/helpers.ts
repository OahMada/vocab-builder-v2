import 'server-only';

import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

export function getBlockBlobClient(blobName: string): BlockBlobClient {
	let storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
	if (!storageAccountName) throw new Error('Azure Storage account name not found');
	let storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
	if (!storageAccountConnectionString) {
		throw Error('Azure Storage Connection string not found');
	}
	let blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);
	let containerName = process.env.AZURE_STORAGE_AUDIO_CONTAINER_NAME;
	if (!containerName) throw new Error('Azure Storage containerName not found.');
	let containerClient = blobServiceClient.getContainerClient(containerName);
	let blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
	return blockBlobClient;
}

export function getBlobNameFromUrl(url: string): string {
	let urlParts = url.split('/').filter(Boolean);
	let blobName = urlParts.at(-1) as string;
	return blobName;
}
