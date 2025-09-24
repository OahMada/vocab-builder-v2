import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { createId } from '@paralleldrive/cuid2';

import { handleZodError } from '@/utils';
import { auth } from '@/auth';
import { ImageFileSchema } from '@/lib';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import getBlockBlobClient from '@/lib/getBlockBlobClient';

export var POST = auth(async function (request: NextAuthRequest) {
	if (!request.auth) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let userId = request.auth.user.id;
	let formData = await request.formData();
	let file = formData.get('file') as File;

	if (!file) {
		return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
	}

	let fileExt = file.name.split('.').pop();

	let result = ImageFileSchema.safeParse(file);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return NextResponse.json({ error }, { status: 400 });
	}

	let arrayBuffer = await result.data.arrayBuffer();
	let buffer = Buffer.from(arrayBuffer);

	let imageFileName = createId() + fileExt;
	console.log('imageFileName', imageFileName);

	let blockBlobClient = getBlockBlobClient(imageFileName, 'image');

	await blockBlobClient.uploadData(buffer, {
		blobHTTPHeaders: { blobContentType: file.type },
	});

	let imageUrl = blockBlobClient.url;
	return NextResponse.json({ data: imageUrl }, { status: 200 });
});
