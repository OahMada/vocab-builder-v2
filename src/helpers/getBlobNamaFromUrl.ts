import 'server-only';

export default function getBlobNameFromUrl(url: string): string {
	let urlParts = url.split('/').filter(Boolean);
	let blobName = urlParts.at(-1) as string;
	return blobName;
}
