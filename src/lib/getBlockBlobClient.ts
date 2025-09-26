import 'server-only';

import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';

export default function getBlockBlobClient(
	type: 'audio' | 'image',
	blobName: string
): { blockBlobClient: BlockBlobClient; containerClient: ContainerClient };
export default function getBlockBlobClient(
	type: 'audio' | 'image',
	blobName?: undefined
): { blockBlobClient: undefined; containerClient: ContainerClient };
export default function getBlockBlobClient(
	type: 'audio' | 'image',
	blobName?: string
): { blockBlobClient: BlockBlobClient | undefined; containerClient: ContainerClient } {
	let storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
	if (!storageAccountName) throw new Error('Azure Storage account name not found');
	let storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
	if (!storageAccountConnectionString) {
		throw Error('Azure Storage Connection string not found');
	}
	let blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);
	let containerName: string | undefined;
	if (type === 'audio') {
		containerName = process.env.AZURE_STORAGE_AUDIO_CONTAINER_NAME;
	} else if (type === 'image') {
		containerName = process.env.AZURE_STORAGE_IMAGE_CONTAINER_NAME;
	}
	if (!containerName) throw new Error('Azure Storage containerName not found');
	let containerClient = blobServiceClient.getContainerClient(containerName);
	let blockBlobClient: BlockBlobClient | undefined = undefined;
	if (blobName) {
		blockBlobClient = containerClient.getBlockBlobClient(blobName);
	}
	return { blockBlobClient, containerClient };
}
